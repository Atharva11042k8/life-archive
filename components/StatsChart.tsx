import React, { useMemo, useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Maximize2, Minimize2, Calendar } from 'lucide-react';
import { HoursData, ChartDataPoint } from '../types';

interface StatsChartProps {
  title: string;
  dataMap: HoursData;
  color: string; // e.g., '#10b981' for emerald-500
  unit: string;
  currentDate: string; // YYYY-MM-DD to determine the month context
}

const StatsChart: React.FC<StatsChartProps> = ({ title, dataMap, color, unit, currentDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Initialize selectedMonth from the passed currentDate (format YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(currentDate.substring(0, 7));

  // Sync internal state if the global currentDate changes (e.g., user navigates in main app)
  useEffect(() => {
    setSelectedMonth(currentDate.substring(0, 7));
  }, [currentDate]);
  
  // Transform the sparse dataMap into a full monthly dataset based on selectedMonth
  const chartData = useMemo(() => {
    if (!selectedMonth) return [];

    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // 0-indexed for Date
    
    // Get days in specific month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const data: ChartDataPoint[] = [];
    
    for (let d = 1; d <= daysInMonth; d++) {
      // Format YYYY-MM-DD to match JSON keys
      const dayStr = d.toString().padStart(2, '0');
      // monthStr is already '01', '02' etc.
      const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
      
      data.push({
        day: d,
        value: dataMap[dateKey] || 0, // Default to 0 if no data
        date: dateKey
      });
    }
    return data;
  }, [dataMap, selectedMonth]);

  const totalHours = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const average = useMemo(() => {
    // Only average over days that have passed or have data to avoid skewing
    const daysWithData = chartData.filter(d => d.value > 0).length;
    return daysWithData ? (totalHours / daysWithData).toFixed(1) : 0;
  }, [totalHours, chartData]);

  // Styles for the container based on expanded state
  const containerClasses = isExpanded
    ? "fixed inset-4 md:inset-10 z-50 bg-[#0e0e0e] border border-white/10 rounded-2xl p-8 flex flex-col shadow-2xl transition-all duration-300"
    : "glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:border-white/20 relative";

  return (
    <>
      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div className={containerClasses}>
        <div className="flex justify-between items-start mb-6 shrink-0 gap-4">
          <div className="flex-1">
              <h3 className={`${isExpanded ? 'text-2xl' : 'text-lg'} font-medium text-white transition-all duration-300`}>
                {title}
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                  <span className={`${isExpanded ? 'text-5xl' : 'text-3xl'} font-bold text-white transition-all duration-300`}>
                    {average}
                  </span>
                  <span className="text-sm text-gray-400">avg {unit}/day</span>
              </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Month Selector */}
            <div className="relative group">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs md:text-sm text-gray-300 outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all cursor-pointer font-mono"
                style={{ colorScheme: 'dark' }} 
              />
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData} 
              margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`colorGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  dy={10}
                  interval={isExpanded ? 0 : 'preserveStartEnd'} 
              />
              <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  // Fix: Add 20% headroom to prevent graph from touching the top or going out of bounds
                  // Ensure minimum domain exists (at least 4) so 0 values don't flatten awkwardly
                  domain={[0, (dataMax: number) => Math.max(Math.ceil((dataMax || 1) * 1.2), 4)]} 
                  width={30}
              />
              <Tooltip
                cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                        <p className="text-gray-400 text-xs mb-1">
                          {selectedMonth} - {payload[0].payload.day.toString().padStart(2, '0')}
                        </p>
                        <p className="text-white font-bold text-sm">
                          {payload[0].value} {unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#colorGradient-${title})`}
                animationDuration={1500}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default StatsChart;