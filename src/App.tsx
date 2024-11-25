import React from 'react';
import { Settings, ShoppingBag, RefreshCw, Share2 } from 'lucide-react';
import { useSettingsStore } from './lib/store';
import { Setup } from './components/Setup';
import { CryptoCard } from './components/CryptoCard';
import { WeatherCard } from './components/WeatherCard';
import toast from 'react-hot-toast';

interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
}

function App() {
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [joke, setJoke] = React.useState('');
  const [weather, setWeather] = React.useState<any>(null);
  const [cryptoPrices, setCryptoPrices] = React.useState<any>({});
  const [coinList, setCoinList] = React.useState<CoinInfo[]>([]);
  const { 
    weatherEnabled, 
    cryptoEnabled, 
    city, 
    selectedCoins, 
    jokesRemaining, 
    decrementJokes,
    resetJokesIfNewDay 
  } = useSettingsStore();

  const fetchJoke = async () => {
    if (jokesRemaining === 0) {
      toast.error('No more jokes available today!');
      return;
    }
    try {
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'WAGMISTUFF Dad Jokes (https://wagmistuff.com)'
        }
      });
      const data = await response.json();
      setJoke(data.joke);
      decrementJokes();
      if (jokesRemaining <= 5) {
        toast('Your coffee is getting cold, you should drink it', {
          icon: '☕',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      toast.error('Failed to fetch joke. Please try again.');
    }
  };

  const shareJoke = () => {
    navigator.share({
      title: 'Daily Dad Joke',
      text: joke,
      url: window.location.href,
    }).catch(console.error);
  };

  React.useEffect(() => {
    resetJokesIfNewDay();
    fetchJoke();
    
    // Fetch coin list once
    fetch('https://api.coingecko.com/api/v3/coins/list')
      .then(res => res.json())
      .then(data => {
        setCoinList(data);
      })
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    if (weatherEnabled && city) {
      fetch(`https://api.weatherapi.com/v1/current.json?key=b7fc36f88fd2432195a231037242511&q=${encodeURIComponent(city)}&aqi=no`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            toast.error(data.error.message || 'City not found');
            return;
          }
          setWeather(data);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          toast.error('Failed to fetch weather data');
        });
    }

    if (cryptoEnabled && selectedCoins.length > 0) {
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoins.join(',')}&vs_currencies=usd&include_24hr_change=true`)
        .then(res => res.json())
        .then(data => {
          if (!data || Object.keys(data).length === 0) {
            toast.error('Failed to fetch crypto prices');
            return;
          }
          setCryptoPrices(data);
        })
        .catch(error => {
          console.error('Error fetching crypto prices:', error);
          toast.error('Failed to fetch crypto prices');
        });
    }
  }, [weatherEnabled, cryptoEnabled, city, selectedCoins]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-['Righteous'] tracking-tight">
              WAGMISTUFF - DAILY DAD JOKE
            </h1>
            <div className="flex items-center gap-4">
              <a
                href="https://wagmistuff.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ShoppingBag className="w-6 h-6" />
              </a>
              <button
                onClick={() => setSetupOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xl leading-relaxed">{joke}</p>
            <div className="flex gap-2">
              <button
                onClick={fetchJoke}
                disabled={jokesRemaining === 0}
                className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={shareJoke}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">Jokes remaining today: {jokesRemaining}</p>
        </div>

        {weatherEnabled && weather && (
          <WeatherCard weather={weather} city={city} />
        )}

        {cryptoEnabled && selectedCoins.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCoins.map((coinId) => {
              const coinInfo = coinList.find(c => c.id === coinId);
              if (!coinInfo) return null;
              
              return (
                <CryptoCard
                  key={coinId}
                  symbol={coinInfo.symbol}
                  name={coinInfo.name}
                  price={cryptoPrices[coinId]?.usd || 0}
                  change={cryptoPrices[coinId]?.usd_24h_change || 0}
                />
              );
            })}
          </div>
        )}
      </main>

      <Setup open={setupOpen} onOpenChange={setSetupOpen} />
    </div>
  );
}

export default App;