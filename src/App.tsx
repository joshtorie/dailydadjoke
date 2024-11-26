import React from 'react';
import { Settings, ShoppingBag, RefreshCw, Share2 } from 'lucide-react';
import { useSettingsStore } from './lib/store';
import { Setup } from './components/Setup';
import { CryptoCard } from './components/CryptoCard';
import { WeatherCard } from './components/WeatherCard';
import toast, { Toaster } from 'react-hot-toast';
import { fetchDadJoke, fetchWeather, fetchCoinList, fetchCryptoPrices } from './services/api';

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
    jokesViewed,
    incrementJokesViewed,
    resetJokesCount,
    lastVisitDate 
  } = useSettingsStore();

  const fetchJoke = async () => {
    const newJoke = await fetchDadJoke();
    if (newJoke) {
      setJoke(newJoke);
      incrementJokesViewed();
      
      if (jokesViewed === 2) {
        toast('Careful, 3 dad jokes are 3 jokes too much', {
          icon: '😅',
          duration: 3000
        });
      } else if (jokesViewed === 4) {
        toast('Drink some coffee, its getting cold', {
          icon: '☕',
          duration: 3000
        });
      } else if (jokesViewed === 6) {
        toast('Are you kidding? How long is your break?', {
          icon: '⏰',
          duration: 3000
        });
      }
    }
  };

  const shareJoke = () => {
    if ('share' in navigator) {
      navigator.share({
        title: 'Daily Dad Joke',
        text: joke,
        url: window.location.href,
      }).catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Unable to share joke');
        }
      });
    } else {
      navigator.clipboard.writeText(joke).then(() => {
        toast.success('Joke copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy joke');
      });
    }
  };

  React.useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastVisitDate) {
      resetJokesCount();
    }
    fetchJoke();
    fetchCoinList().then(setCoinList);
  }, []);

  React.useEffect(() => {
    if (weatherEnabled && city) {
      fetchWeather(city).then(data => {
        if (data?.error) {
          toast.error(data.error.message || 'City not found');
          return;
        }
        setWeather(data);
      });
    }

    if (cryptoEnabled && selectedCoins.length > 0) {
      fetchCryptoPrices(selectedCoins).then(setCryptoPrices);
    }
  }, [weatherEnabled, cryptoEnabled, city, selectedCoins]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
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
                className="p-2 hover:bg-gray-100 rounded-full transition"
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
          <p className="text-sm text-gray-500">Dad jokes viewed today: {jokesViewed}</p>
        </div>

        {weatherEnabled && weather && (
          <WeatherCard weather={weather} city={city} />
        )}

        {cryptoEnabled && selectedCoins.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-['Righteous'] mb-6 text-gray-800">Tracked Coins</h2>
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
          </div>
        )}
      </main>

      <Setup open={setupOpen} onOpenChange={setSetupOpen} />
    </div>
  );
}

export default App;