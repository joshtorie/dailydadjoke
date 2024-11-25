import React from 'react';
import { Share2 } from 'lucide-react';

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export function CryptoCard({ symbol, name, price, change }: CryptoCardProps) {
  const sharePrice = () => {
    navigator.share({
      title: `${name} (${symbol.toUpperCase()}) Price Update`,
      text: `Current ${name} price: $${price.toFixed(2)} (${change >= 0 ? '+' : ''}${change.toFixed(2)}% in 12h)`,
      url: window.location.href,
    }).catch(console.error);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500 uppercase">{symbol}</p>
        <p className="text-2xl font-bold">${price.toFixed(2)}</p>
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% (12h)
        </p>
      </div>
      <button
        onClick={sharePrice}
        className="p-2 hover:bg-gray-100 rounded-full transition"
        aria-label="Share price"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}