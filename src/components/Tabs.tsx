import React from 'react';
import { DistrictTab, FuelStatusFilter } from '../types/station';
import { Search, X, MapPin } from 'lucide-react';

interface TabsProps {
  currentDistrict: DistrictTab;
  onSelectDistrict: (district: DistrictTab) => void;
  nagornayaAvailableCount: number;
  nagornayaTotalCount: number;
  leninskyAvailableCount: number;
  leninskyTotalCount: number;
  activeFilter: FuelStatusFilter;
  onSelectFilter: (filter: FuelStatusFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  currentDistrict,
  onSelectDistrict,
  nagornayaAvailableCount,
  nagornayaTotalCount,
  leninskyAvailableCount,
  leninskyTotalCount,
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="space-y-3">
      {/* Primary District Segmented Control */}
      <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner">
        <button
          type="button"
          onClick={() => onSelectDistrict('nagornaya')}
          className={`relative flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all ${
            currentDistrict === 'nagornaya'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-1 text-xs sm:text-sm font-bold">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
            <span>Нагорная часть</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-medium opacity-90 mt-0.5">
            {nagornayaAvailableCount} из {nagornayaTotalCount} АЗС
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectDistrict('leninsky')}
          className={`relative flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all ${
            currentDistrict === 'leninsky'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-1 text-xs sm:text-sm font-bold">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
            <span>Ленинский район</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-medium opacity-90 mt-0.5">
            {leninskyAvailableCount} из {leninskyTotalCount} АЗС
          </div>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по улице, номеру дома или бренду..."
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 focus:border-emerald-500/50 rounded-xl text-slate-100 placeholder-slate-500 outline-none transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Очистить поиск"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => onSelectFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
            activeFilter === 'all'
              ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
          }`}
        >
          Все
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('available_only')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border flex items-center gap-1 ${
            activeFilter === 'available_only'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Только в наличии
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('no_queue')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border flex items-center gap-1 ${
            activeFilter === 'no_queue'
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          Без очереди (&lt;15 мин)
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('lukoil')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
            activeFilter === 'lukoil'
              ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
          }`}
        >
          Лукойл
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('gpn')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
            activeFilter === 'gpn'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
          }`}
        >
          Газпромнефть
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('teboil')}
          className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
            activeFilter === 'teboil'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
          }`}
        >
          Teboil
        </button>
      </div>
    </div>
  );
};
