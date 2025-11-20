import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'pink' | 'yellow' | 'blue' | 'purple';
  suffix?: string;
}

const styles = {
  pink: 'bg-pink-100 text-pink-500',
  yellow: 'bg-yellow-100 text-yellow-600',
  blue: 'bg-blue-100 text-blue-500',
  purple: 'bg-purple-100 text-purple-500',
};

export const StatsCard: React.FC<Props> = ({ label, value, icon: Icon, color, suffix }) => {
  return (
    <div className={`p-4 rounded-[2rem] flex items-center gap-4 ${styles[color].replace('text-', 'bg-opacity-50 ')} bg-opacity-30 border-2 border-white/50`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm ${styles[color]}`}>
        <Icon size={24} strokeWidth={3} />
      </div>
      <div>
        <div className="text-xs font-bold opacity-60 uppercase">{label}</div>
        <div className="text-xl font-black opacity-90 flex items-baseline gap-1">
          {value}
          {suffix && <span className="text-xs opacity-60">{suffix}</span>}
        </div>
      </div>
    </div>
  );
};