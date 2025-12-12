import React, { useState } from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import { BucketItem } from '../types';

interface BucketListProps {
  items: BucketItem[];
}

const BucketList: React.FC<BucketListProps> = ({ items }) => {
  // Local state to handle interactivity (since we can't save to JSON file in this environment)
  const [localItems, setLocalItems] = useState<BucketItem[]>(items);

  const toggleItem = (id: number) => {
    setLocalItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Sync prop changes if they occur (e.g. initial load)
  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const progress = Math.round(
    (localItems.filter(i => i.completed).length / (localItems.length || 1)) * 100
  );

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-medium text-white flex items-center gap-2">
            <Target className="text-purple-400" size={20} />
            Life Checklist
          </h3>
          <p className="text-sm text-gray-400 mt-1">Things to do before death</p>
        </div>
        <div className="flex flex-col items-end">
             <span className="text-2xl font-bold text-white">{progress}%</span>
             <span className="text-xs text-gray-500 uppercase tracking-widest">Completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {localItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`
              p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all duration-200
              ${item.completed 
                ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
            `}
          >
            <div className={`
              shrink-0 transition-colors duration-300
              ${item.completed ? 'text-purple-400' : 'text-gray-500'}
            `}>
              {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </div>
            <span className={`
              text-sm transition-all duration-300
              ${item.completed ? 'text-gray-400 line-through' : 'text-gray-200'}
            `}>
              {item.task}
            </span>
          </div>
        ))}
        
        {localItems.length === 0 && (
           <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
             No goals set yet.
           </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white/5 h-1 mt-6 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
      </div>
    </div>
  );
};

export default BucketList;
