import { Investment } from '@/pages/index';
import { calculateWeek } from './weekUtils';

export function generateMockInvestments(): Investment[] {
  const now = new Date();
  const mockData: Investment[] = [
    {
      id: '1',
      symbol: 'AAPL',
      buyPrice: 150.25,
      shares: 10,
      totalPrice: 1502.50,
      date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: calculateWeek(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    },
    {
      id: '2',
      symbol: 'TSLA',
      buyPrice: 220.00,
      shares: 5,
      totalPrice: 1100.00,
      date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: calculateWeek(new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    },
    {
      id: '3',
      symbol: 'MSFT',
      buyPrice: 380.50,
      shares: 3,
      totalPrice: 1141.50,
      date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: calculateWeek(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    },
    {
      id: '4',
      symbol: 'SPY',
      buyPrice: 420.00,
      shares: 5,
      totalPrice: 2100.00,
      date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: calculateWeek(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    },
    {
      id: '5',
      symbol: 'QQQ',
      buyPrice: 350.00,
      shares: 4,
      totalPrice: 1400.00,
      date: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: calculateWeek(new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    },
  ];

  return mockData;
}