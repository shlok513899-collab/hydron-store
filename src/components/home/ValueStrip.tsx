import React from 'react';
import { 
  Award, 
  Thermometer, 
  Droplet, 
  Hand,
  CheckCircle,
  Shield
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ValueStrip: React.FC = () => {
  const { homepageContent } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'award':
      case 'shield':
      case 'badge':
        return <Award className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />;
      case 'thermometer':
      case 'temp':
        return <Thermometer className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />;
      case 'droplet':
      case 'water':
      case 'leak':
        return <Droplet className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />;
      case 'hand':
      case 'carry':
      case 'grip':
        return <Hand className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />;
      default:
        return <Award className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />;
    }
  };

  const defaultItems = [
    {
      icon: 'award',
      title: 'PREMIUM',
      subtitle: 'MATERIALS',
      desc: '18/8 Pro-Grade Steel & Grade 1 Titanium'
    },
    {
      icon: 'thermometer',
      title: 'TEMPERATURE',
      subtitle: 'LOCK TECHNOLOGY',
      desc: 'Triple-wall copper barrier insulation'
    },
    {
      icon: 'droplet',
      title: 'LEAK PROOF',
      subtitle: 'DESIGN',
      desc: 'Zero spills with pressure silicone seal'
    },
    {
      icon: 'hand',
      title: 'EASY TO CARRY',
      subtitle: 'ANYWHERE',
      desc: 'Ergonomic loop handle & slim profile'
    },
  ];

  const items = homepageContent.valueItems?.length ? homepageContent.valueItems : defaultItems;

  return (
    <div className="w-full bg-[#fcfcfd] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3 sm:gap-4 ${
                idx > 0 ? 'sm:pl-6 lg:pl-8' : ''
              } ${idx % 2 === 1 ? 'pt-4 sm:pt-0' : ''}`}
            >
              {/* Icon */}
              <div className="text-black shrink-0 p-2 rounded-none bg-zinc-100 border border-zinc-300/80">
                {getIcon(item.icon)}
              </div>

              {/* Title & Subtitle Matching Reference Typography */}
              <div className="text-left">
                <p className="text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.12em] text-black font-heading leading-tight">
                  {item.title}
                </p>
                <p className="text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.12em] text-black font-heading leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
