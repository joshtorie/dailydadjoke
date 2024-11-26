import toast from 'react-hot-toast';

const BASE_HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'WAGMISTUFF (https://wagmistuff.com)'
};

interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  { maxRetries = 3, baseDelay = 1000 }: RetryConfig = {}
) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...BASE_HEADERS, ...options.headers }
      });

      if (response.ok) {
        return await response.json();
      }

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '30', 10);
        const delay = retryAfter * 1000 || baseDelay * Math.pow(2, attempt);
        
        toast.loading(`Rate limited, retrying in ${Math.ceil(delay/1000)}s...`, {
          duration: delay
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw new Error('Max retries reached');
}

export async function fetchDadJoke() {
  try {
    const data = await fetchWithRetry('https://icanhazdadjoke.com/');
    return data.joke;
  } catch (error) {
    console.error('Error fetching joke:', error);
    toast.error('Failed to fetch joke. Please try again.');
    return null;
  }
}

export async function fetchWeather(city: string) {
  try {
    return await fetchWithRetry(
      `https://api.weatherapi.com/v1/current.json?key=b7fc36f88fd2432195a231037242511&q=${encodeURIComponent(city)}&aqi=no`
    );
  } catch (error) {
    console.error('Error fetching weather:', error);
    toast.error('Failed to fetch weather data');
    return null;
  }
}

export async function fetchCoinList() {
  try {
    return await fetchWithRetry('https://api.coingecko.com/api/v3/coins/list');
  } catch (error) {
    console.error('Error fetching coins:', error);
    toast.error('Unable to load coins. Please try again later.');
    return [];
  }
}

export async function fetchCryptoPrices(coinIds: string[]) {
  if (!coinIds.length) return {};
  
  try {
    return await fetchWithRetry(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
    );
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    toast.error('Failed to fetch crypto prices');
    return {};
  }
}