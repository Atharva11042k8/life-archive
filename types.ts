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

export interface AppState {
  study: HoursData;
  sleep: HoursData;
  summary: SummaryData;
  isLoading: boolean;
  error: string | null;
}

export interface DailyData {
  summary: string | null;
  sleep: number | null;
  study: number | null;
  isLoading: boolean;
}
