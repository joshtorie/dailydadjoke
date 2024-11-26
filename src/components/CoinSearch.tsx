import React from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCoinList } from '../services/api';

interface Coin {
  id: string;
  symbol: string;
  name: string;
}

interface CoinSearchProps {
  selectedCoins: string[];
  onToggleCoin: (coinId: string) => void;
}

export function CoinSearch({ selectedCoins, onToggleCoin }: CoinSearchProps) {
  const [search, setSearch] = React.useState('');
  const [coins, setCoins] = React.useState<Coin[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [filteredCoins, setFilteredCoins] = React.useState<Coin[]>([]);

  React.useEffect(() => {
    setLoading(true);
    fetchCoinList()
      .then(setCoins)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    const filtered = coins.filter(
      coin =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
    setFilteredCoins(filtered);
  }, [search, coins]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading coins...</div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredCoins.map((coin) => (
            <button
              key={coin.id}
              onClick={() => onToggleCoin(coin.id)}
              disabled={selectedCoins.length >= 3 && !selectedCoins.includes(coin.id)}
              className={`w-full p-3 text-left rounded-lg transition ${
                selectedCoins.includes(coin.id)
                  ? 'bg-blue-100 border-blue-500 border'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              } ${
                selectedCoins.length >= 3 && !selectedCoins.includes(coin.id)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{coin.name}</span>
                <span className="text-gray-500 uppercase">{coin.symbol}</span>
              </div>
            </button>
          ))}
          {filteredCoins.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500">
              No coins found matching your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}