export interface HoursData {
  [date: string]: number;
}

export interface SummaryData {
  [date: string]: string;
}

export interface ChartDataPoint {
  day: number;
  value: number;
  date: string;
}

export interface BucketItem {
  id: number;
  task: string;
  completed: boolean;
}

export interface AppState {
  study: HoursData;
  sleep: HoursData;
  summary: SummaryData;
  bucketList: BucketItem[];
  isLoading: boolean;
  error: string | null;
}

export interface DailyData {
  summary: string | null;
  sleep: number | null;
  study: number | null;
  isLoading: boolean;
}
