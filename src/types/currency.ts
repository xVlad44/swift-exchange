
export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface ExchangeRate {
  [key: string]: number;
}

export interface ConversionHistoryItem {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: Date;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}
