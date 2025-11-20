import React from 'react';

interface Props {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<Props> = ({ color = 'text-white' }) => {
  return (
    <div className={`flex space-x-1 ${color}`}>
      <div className="w-3 h-3 bg-current rounded-full animate-[bounce_1s_infinite]"></div>
      <div className="w-3 h-3 bg-current rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
      <div className="w-3 h-3 bg-current rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
    </div>
  );
};