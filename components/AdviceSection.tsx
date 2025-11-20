import React from 'react';
import { Coffee, Music, BookOpen, Sun, Smile, Zap, Wind, CloudRain, Star } from 'lucide-react';
import { AdviceItem } from '../types';

interface Props {
  emotion: string;
}

const getAdvice = (emotion: string): AdviceItem[] => {
  // Simplified logic for demo
  if (emotion.includes('快乐') || emotion.includes('兴奋')) {
    return [
      { title: "分享快乐", content: "把这份喜悦告诉好朋友！", icon: "Star", color: "bg-yellow-100 text-yellow-500" },
      { title: "奖励自己", content: "去买那个喜欢很久的小蛋糕吧。", icon: "Smile", color: "bg-pink-100 text-pink-500" },
    ];
  } else if (emotion.includes('悲伤') || emotion.includes('焦虑')) {
    return [
      { title: "抱抱自己", content: "没关系的，允许自己难过一小会儿。", icon: "CloudRain", color: "bg-blue-100 text-blue-500" },
      { title: "深呼吸", content: "吸气... 呼气... 世界还在转动。", icon: "Wind", color: "bg-cyan-100 text-cyan-500" },
    ];
  }
  return [
    { title: "去散步", content: "外面的空气很清新哦。", icon: "Sun", color: "bg-orange-100 text-orange-500" },
    { title: "听首歌", content: "戴上耳机，这是属于你的世界。", icon: "Music", color: "bg-purple-100 text-purple-500" },
  ];
};

const IconMap: Record<string, any> = { Coffee, Music, BookOpen, Sun, Smile, Zap, Wind, CloudRain, Star };

export const AdviceSection: React.FC<Props> = ({ emotion }) => {
  const items = getAdvice(emotion);

  return (
    <div className="space-y-4">
      <h4 className="font-black text-slate-700 mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-yellow-400" /> 小贴士
      </h4>
      {items.map((item, idx) => {
        const Icon = IconMap[item.icon] || Smile;
        return (
          <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-pink-100 cursor-default">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
              <Icon size={24} strokeWidth={3} />
            </div>
            <div>
              <div className="font-bold text-slate-700">{item.title}</div>
              <div className="text-xs text-slate-400 font-bold">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
import { Sparkles } from 'lucide-react';