import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';

interface WeatherCardProps {
  weather: any;
  city: string;
}

export function WeatherCard({ weather, city }: WeatherCardProps) {
  if (!weather.current) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-['Righteous'] mb-1">The weather in {city} right now:</h2>
          <div className="flex items-center gap-2">
            <img 
              src={weather.current.condition.icon} 
              alt={weather.current.condition.text}
              className="w-16 h-16"
            />
            <div>
              <p className="text-3xl font-bold">{weather.current.temp_c}°C</p>
              <p className="text-gray-600">{weather.current.condition.text}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span>{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <span>{weather.current.wind_kph} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-gray-400" />
            <span>{weather.current.cloud}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}