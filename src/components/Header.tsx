import React from 'react';
import { Fuel, RotateCw, Radio, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  lastUpdatedTime: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  isLiveApi: boolean;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdatedTime,
  isRefreshing,
  onRefresh,
  isLiveApi,
  onOpenInfo
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 pt-3 pb-2.5">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-sky-500/20 to-indigo-500/20 border border-emerald-500/30 shadow-inner shrink-0">
            <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                Бензин Радар НН
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md shrink-0">
                АИ-95
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
              <span className="flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 animate-pulse shrink-0" />
                <span>{lastUpdatedTime}</span>
              </span>
              {isLiveApi ? (
                <span className="inline-flex items-center px-1.5 py-0.2 text-[8px] sm:text-[9px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded">
                  Live API
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.2 text-[8px] sm:text-[9px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded">
                  Слепок
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <PWAInstallButton />

          <button
            type="button"
            onClick={onOpenInfo}
            aria-label="Инструкция и справка"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 active:scale-95 transition-all"
            title="Инструкция и справка"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Обновить данные"
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 active:scale-95 transition-all disabled:opacity-60 shadow-sm shadow-emerald-950/50"
          >
            <RotateCw className={`w-3.5 h-3.5 shrink-0 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="font-medium text-[11px] sm:text-xs">{isRefreshing ? 'Загрузка...' : 'Обновить'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
