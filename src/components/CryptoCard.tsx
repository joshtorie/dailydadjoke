import React from 'react';

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export function CryptoCard({ symbol, name, price, change }: CryptoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div>
        <h3 className="text-lg font-['Righteous']">{name}</h3>
        <p className="text-sm text-gray-500 uppercase">{symbol}</p>
        <p className="text-2xl font-bold mt-2">${price.toFixed(2)}</p>
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% (12h)
        </p>
      </div>
    </div>
  );
}