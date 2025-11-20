import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse">
             <span className="text-2xl">🧠</span>
        </div>
      </div>
      <p className="text-indigo-600 font-bold tracking-widest animate-pulse text-lg">
        深度神经网络分析中...
      </p>
    </div>
  );
};