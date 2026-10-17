import React from 'react';
import { Gauge, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DeficitSummaryProps {
  districtTitle: string;
  totalStations: number;
  availableCount: number;
  freeCount: number;
  queueCount: number;
  emptyCount: number;
}

export const DeficitSummary: React.FC<DeficitSummaryProps> = ({
  districtTitle,
  totalStations,
  availableCount,
  freeCount,
  queueCount,
  emptyCount
}) => {
  const percentage = totalStations > 0 ? Math.round((availableCount / totalStations) * 100) : 0;
  const freePct = totalStations > 0 ? (freeCount / totalStations) * 100 : 0;
  const queuePct = totalStations > 0 ? (queueCount / totalStations) * 100 : 0;
  const emptyPct = totalStations > 0 ? (emptyCount / totalStations) * 100 : 0;

  let statusTone = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let statusText = 'Доступно в норме';
  if (percentage < 40) {
    statusTone = 'text-red-400 bg-red-500/10 border-red-500/30';
    statusText = 'Острый дефицит АИ-95';
  } else if (percentage < 70) {
    statusTone = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    statusText = 'Умеренный дефицит АИ-95';
  }

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg">
      <div className="flex items-start sm:items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Сводка дефицита · {districtTitle}
            </h2>
            <div className="text-sm sm:text-base font-extrabold text-white flex items-baseline gap-1.5 flex-wrap">
              <span>В наличии {availableCount} из {totalStations} АЗС</span>
              <span className="text-xs font-semibold text-emerald-400">({percentage}%)</span>
            </div>
          </div>
        </div>

        <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:py-1 rounded-lg border shrink-0 ${statusTone}`}>
          {statusText}
        </span>
      </div>

      {/* Multi-segment stacked bar */}
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden flex mb-3 p-0.5 gap-0.5">
        {freePct > 0 && (
          <div
            style={{ width: `${freePct}%` }}
            className="h-full bg-emerald-500 rounded-sm transition-all duration-500 shadow-sm shadow-emerald-500/50"
            title={`Свободно: ${freeCount}`}
          />
        )}
        {queuePct > 0 && (
          <div
            style={{ width: `${queuePct}%` }}
            className="h-full bg-amber-400 rounded-sm transition-all duration-500 shadow-sm shadow-amber-400/50"
            title={`Очередь: ${queueCount}`}
          />
        )}
        {emptyPct > 0 && (
          <div
            style={{ width: `${emptyPct}%` }}
            className="h-full bg-slate-700 rounded-sm transition-all duration-500"
            title={`Нет топлива: ${emptyCount}`}
          />
        )}
      </div>

      {/* Breakdown Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl py-1.5 px-2">
          <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{freeCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Свободно</span>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl py-1.5 px-2">
          <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{queueCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Очередь</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl py-1.5 px-2">
          <div className="flex items-center justify-center gap-1 text-slate-400 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{emptyCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Нет 95-го</span>
        </div>
      </div>
    </div>
  );
};
