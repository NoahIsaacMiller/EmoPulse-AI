import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { EmotionMetric } from '../types';

interface Props {
  data: EmotionMetric[];
  accentColor: string;
}

export const EmotionRadar: React.FC<Props> = ({ data, accentColor }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="emotion" 
            tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="强度"
            dataKey="score"
            stroke={accentColor}
            strokeWidth={4}
            fill={accentColor}
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '12px',
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: '#334155' 
            }}
            itemStyle={{ color: accentColor, fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};