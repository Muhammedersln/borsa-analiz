import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShieldAlert,
  Target,
  CandlestickChart,
  FileBarChart2,
  PieChart,
  Bookmark,
  Compass,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

export const toolIcons: Record<string, ComponentType<LucideProps>> = {
  search: Search,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'bar-chart': BarChart3,
  'shield-alert': ShieldAlert,
  target: Target,
  candle: CandlestickChart,
  'file-chart': FileBarChart2,
  'pie-chart': PieChart,
  bookmark: Bookmark,
  compass: Compass,
};
