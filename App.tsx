import React, { useEffect, useState, useMemo } from 'react';
import Header from './components/Header';
import DailySummary from './components/DailySummary';
import StatsChart from './components/StatsChart';
import BucketList from './components/BucketList';
import { fetchMonthData, fetchBucketList } from './services/dataService';
import { AppState, DailyData } from './types';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getDateStructure } from './utils/datePath';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>({
    study: {},
    sleep: {},
    summary: {},
    bucketList: [],
    isLoading: true,
    error: null,
  });

  const [selectedDate, setSelectedDate] = useState<string>('2025-01-01');
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

  // Function to ensure month data is loaded
  const ensureMonthData = async (dateStr: string) => {
    const { year, month } = getDateStructure(dateStr);
    const monthKey = `${year}-${month}`;

    if (loadedMonths.has(monthKey)) return;

    try {
      setData(prev => ({ ...prev, isLoading: true }));
      const result = await fetchMonthData(dateStr);
      
      setData(prev => ({
        ...prev,
        study: { ...prev.study, ...result.study },
        sleep: { ...prev.sleep, ...result.sleep },
        summary: { ...prev.summary, ...result.summary },
        isLoading: false,
        error: null,
      }));
      
      setLoadedMonths(prev => new Set(prev).add(monthKey));
    } catch (err) {
      console.error(err);
      setData(prev => ({ ...prev, isLoading: false, error: 'Failed to load monthly data.' }));
    }
  };

  // Initial Load (Month Data + Bucket List)
  useEffect(() => {
    const loadInitial = async () => {
        try {
            const bucketData = await fetchBucketList();
            setData(prev => ({ ...prev, bucketList: bucketData }));
            await ensureMonthData(selectedDate);
        } catch (err) {
            console.error("Initial load error", err);
        }
    };
    loadInitial();
  }, []);

  // Fetch when date changes (if month not loaded)
  useEffect(() => {
    ensureMonthData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Derive DailyData for the specific selected date
  const currentDailyData: DailyData = useMemo(() => {
    return {
      summary: data.summary[selectedDate] || null,
      sleep: data.sleep[selectedDate] ?? null,
      study: data.study[selectedDate] ?? null,
      isLoading: data.isLoading && !loadedMonths.has(`${getDateStructure(selectedDate).year}-${getDateStructure(selectedDate).month}`)
    };
  }, [selectedDate, data, loadedMonths]);

  if (data.error && data.bucketList.length === 0) { // Only show full error if bucket list also failed or critical
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-xl border-red-500/30 max-w-md w-full text-center">
          <h2 className="text-xl text-red-400 font-bold mb-2">System Error</h2>
          <p className="text-gray-400 mb-4">{data.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] pb-12 overflow-x-hidden text-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="glass-card p-1.5 rounded-xl flex items-center gap-2">
            <button 
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-transparent border-none text-white font-mono text-sm focus:ring-0 date-picker-custom outline-none"
            />
            <button 
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="text-xs font-mono text-gray-500 flex gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Study Data
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Sleep Data
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Daily Archive Summary */}
          {/* We make this sticky or fixed height to match visual balance, 
              but since right side grows, let's keep it h-[500px] or make it auto */}
          <div className="lg:col-span-4 h-[500px] lg:h-auto">
            <DailySummary date={selectedDate} data={currentDailyData} />
          </div>

          {/* Right Column: Graphs & Bucket List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Study Graph */}
            <div className="h-64">
              <StatsChart 
                title="Study Focus" 
                unit="hrs" 
                dataMap={data.study} 
                color="#10b981" // emerald-500
                currentDate={selectedDate}
              />
            </div>

            {/* Sleep Graph */}
            <div className="h-64">
              <StatsChart 
                title="Sleep Cycles" 
                unit="hrs" 
                dataMap={data.sleep} 
                color="#3b82f6" // blue-500
                currentDate={selectedDate}
              />
            </div>

            {/* Things to do before death */}
            <div className="min-h-[200px]">
              <BucketList items={data.bucketList} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
