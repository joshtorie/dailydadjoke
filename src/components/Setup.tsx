import React from 'react';
import { useSettingsStore } from '../lib/store';
import * as Dialog from '@radix-ui/react-dialog';
import { Switch } from './ui/Switch';
import { MapPin, Coins, Search } from 'lucide-react';
import { CoinSearch } from './CoinSearch';

interface City {
  name: string;
  country: string;
}

export function Setup({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { updateSettings, weatherEnabled, cryptoEnabled, city: savedCity, selectedCoins: savedCoins } = useSettingsStore();
  const [citySearch, setCitySearch] = React.useState(savedCity);
  const [cityResults, setCityResults] = React.useState<City[]>([]);
  const [selectedCoins, setSelectedCoins] = React.useState<string[]>(savedCoins);
  const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const searchCities = async (query: string) => {
    if (!query) {
      setCityResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=b7fc36f88fd2432195a231037242511&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setCityResults(data);
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  const handleCitySearch = (value: string) => {
    setCitySearch(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        searchCities(value);
      }, 500)
    );
  };

  const selectCity = (city: City) => {
    setCitySearch(`${city.name}, ${city.country}`);
    setCityResults([]);
  };

  const toggleCoin = (coinId: string) => {
    setSelectedCoins(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(c => c !== coinId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, coinId];
    });
  };

  const handleSave = () => {
    updateSettings({
      weatherEnabled,
      cryptoEnabled,
      city: citySearch,
      selectedCoins,
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-xl overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">Setup Your Experience</Dialog.Title>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Enable Weather Updates
              </label>
              <Switch
                checked={weatherEnabled}
                onCheckedChange={(checked) => updateSettings({ weatherEnabled: checked })}
              />
            </div>

            {weatherEnabled && (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    value={citySearch}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {cityResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {cityResults.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => selectCity(city)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      >
                        {city.name}, {city.country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Track Crypto Prices
              </label>
              <Switch
                checked={cryptoEnabled}
                onCheckedChange={(checked) => updateSettings({ cryptoEnabled: checked })}
              />
            </div>

            {cryptoEnabled && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Select up to 3 coins to track:</p>
                <CoinSearch
                  selectedCoins={selectedCoins}
                  onToggleCoin={toggleCoin}
                />
                <p className="text-sm text-gray-500">
                  {selectedCoins.length}/3 coins selected
                </p>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Preferences
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}