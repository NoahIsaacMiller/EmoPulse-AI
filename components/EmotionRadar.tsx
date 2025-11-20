import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { EmotionDetail } from '../types';

interface Props {
  data: EmotionDetail[];
  color?: string;
}

export const EmotionRadar: React.FC<Props> = ({ data, color = '#A855F7' }) => {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
        <defs>
          <linearGradient id="cuteGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9EB5" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#8FD3F4" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <PolarGrid 
          stroke="#E2E8F0" 
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <PolarAngleAxis 
          dataKey="name" 
          tick={{ 
            fill: '#94A3B8', 
            fontSize: 12, 
            fontWeight: 800,
            fontFamily: 'Nunito'
          }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="情绪值"
          dataKey="value"
          stroke="#FF7597"
          strokeWidth={4}
          fill="url(#cuteGradient)"
          fillOpacity={1}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};