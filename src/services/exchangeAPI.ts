
import { ExchangeRate, HistoricalRate } from '@/types/currency';

const API_BASE = 'https://api.exchangerate-api.com/v4/latest';

export const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRate> => {
  try {
    const response = await fetch(`${API_BASE}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback mock data for development
    return {
      'USD': 1,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 0.92,
      'CNY': 6.4,
      'INR': 74.5,
      'BRL': 5.2
    };
  }
};

export const fetchHistoricalRates = async (
  fromCurrency: string, 
  toCurrency: string
): Promise<HistoricalRate[]> => {
  try {
    // For demo purposes, we'll generate mock historical data
    // In a real app, you'd use a service like exchangerate-api.com's historical endpoint
    const today = new Date();
    const data: HistoricalRate[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate mock rate with some variation
      const baseRate = await fetchExchangeRates(fromCurrency);
      const currentRate = baseRate[toCurrency];
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const rate = currentRate * (1 + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: Math.max(0, rate) // Ensure non-negative
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    // Fallback mock data
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        rate: 0.85 + (Math.random() - 0.5) * 0.1
      };
    });
  }
};
