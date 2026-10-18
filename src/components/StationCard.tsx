import React from 'react';
import { Station } from '../types/station';
import {
  check95Fuel,
  isQueueStation,
  formatQueueTrafficLight,
  parseLimit,
  getFreshnessText,
  getBrandInfo,
  getNavigationUrls,
  calculateWhereBenzConfidence
} from '../utils/fuelLogic';
import {
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  Fuel,
  AlertTriangle
} from 'lucide-react';

interface StationCardProps {
  station: Station;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const brandInfo = getBrandInfo(station.brand, station.name);
  const fuelInfo = check95Fuel(station);
  const queueTraffic = formatQueueTrafficLight(station.detail);
  const limit = parseLimit(station.detail);

  // Automatic payment terminal signal is ONLY present when station.svc is provided
  const hasAutoSignal = Boolean(station.svc || station.svc_only);
  const autoTime = hasAutoSignal ? (station.last_auto_at || station.last_at) : null;
  const driverTime = station.last_driver_at || (station.svc === 'only' ? null : station.last_at);
  const isSvcOnly = station.svc === 'only' || station.svc_only;

  const driverFreshness = getFreshnessText(driverTime || undefined);
  const autoFreshness = getFreshnessText(autoTime || undefined);
  const { yandexUrl, twoGisUrl, gdebenzUrl } = getNavigationUrls(station);

  // Exact WhereBenz confidence with time decay based on driver confirmation
  const confidencePct = calculateWhereBenzConfidence(
    station.confidence_base,
    driverTime || undefined
  );

  // Status plate styling: distinguishes 'АИ-95 В НАЛИЧИИ', 'АИ-95 · ОЧЕРЕДЬ', and 'НЕТ АИ-95'
  const isHeavyQueue = isQueueStation(station);

  let statusBannerClass = '';
  let statusText = '';
  let statusIcon = null;

  if (fuelInfo.state === 'none') {
    statusBannerClass = 'bg-slate-800/80 text-slate-400 border-slate-700/60';
    statusText = 'НЕТ АИ-95';
    statusIcon = <span className="w-2 h-2 rounded-full bg-slate-500" />;
  } else if (isHeavyQueue) {
    statusBannerClass = 'bg-amber-500/15 text-amber-300 border-amber-500/40';
    statusText = 'АИ-95 · ОЧЕРЕДЬ';
    statusIcon = <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />;
  } else {
    statusBannerClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    statusText = 'АИ-95 В НАЛИЧИИ';
    statusIcon = <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />;
  }

  // Queue traffic light styles
  let queueBadgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
  if (queueTraffic) {
    if (queueTraffic.level === 'green') {
      queueBadgeClass = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    } else if (queueTraffic.level === 'yellow') {
      queueBadgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    } else if (queueTraffic.level === 'red') {
      queueBadgeClass = 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-semibold animate-pulse';
    }
  }

  const sanitizedDetail = station.detail
    ? station.detail
        .replace(/(\d+[.,]\d{2}\s*(?:₽|руб\.?|рублей))/gi, '')
        .replace(/·\s*·/g, '·')
        .replace(/^[\s·,]+|[\s·,]+$/g, '')
        .trim() || null
    : null;

  return (
    <article className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-lg transition-all duration-200">
      {/* Top Row: Brand & Status Plate */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Brand Icon Badge */}
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${brandInfo.accentBg} ${brandInfo.badgeBorder}`}
          >
            {brandInfo.type === 'lukoil' ? (
              <span className="font-black text-xs sm:text-sm tracking-tighter text-red-400">ЛК</span>
            ) : brandInfo.type === 'gpn' ? (
              <span className="font-black text-xs sm:text-sm tracking-tighter text-sky-400">ГПН</span>
            ) : brandInfo.type === 'teboil' ? (
              <span className="font-black text-xs sm:text-sm tracking-tighter text-amber-400">TB</span>
            ) : (
              <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white truncate">
            {station.name || brandInfo.displayName}
          </h3>
        </div>

        {/* Status Plate */}
        <div
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border tracking-wide shadow-sm ${statusBannerClass}`}
        >
          {statusIcon}
          <span>{statusText}</span>
        </div>
      </div>

      {/* Dedicated Address Row: Full width, clean, never cramped */}
      <div className="flex items-start gap-1.5 text-xs text-slate-300 mb-2.5 leading-snug">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500 mt-0.5" />
        <span className="break-words font-medium">{station.addr || station.address || 'Нижний Новгород'}</span>
      </div>

      {/* Badges Bar: Fuel Type, Euro-5, Confidence */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5 pt-0.5">
        {/* Specific Fuel Badge: 95 Экто / 95 G-Drive / АИ-95 */}
        {fuelInfo.has95Plus ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
            <span>✨</span>
            <span>{brandInfo.premiumFuelName}</span>
          </span>
        ) : fuelInfo.has95 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            АИ-95
          </span>
        ) : null}

        {/* Euro-5 / K5 Class */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80">
          <Award className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Евро-5 (К5)</span>
        </span>

        {/* Confidence rating strictly adhering to Gdebenz scale */}
        {confidencePct !== null && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800/80 text-sky-300 border border-slate-700/80"
            title={`Вероятность наличия по данным ГдеБЕНЗ: ${confidencePct}%`}
          >
            <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
            <span>{confidencePct}%</span>
          </span>
        )}
      </div>

      {/* Middle Row: Traffic Light Queue & Limits */}
      <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/90 mb-3 space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-1.5">
          {/* Queue traffic light */}
          {queueTraffic ? (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] sm:text-xs shrink-0 ${queueBadgeClass}`}>
              <span>{queueTraffic.icon}</span>
              <span className="font-medium">{queueTraffic.text}</span>
            </div>
          ) : fuelInfo.state === 'queue' ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] sm:text-xs shrink-0 bg-amber-500/10 text-amber-300 border-amber-500/30">
              <span>🟡</span>
              <span className="font-medium">Очередь</span>
            </div>
          ) : fuelInfo.state === 'available' ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] sm:text-xs shrink-0 bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
              <span>🟢</span>
              <span className="font-medium">Без очереди</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-slate-500 text-[11px] sm:text-xs shrink-0">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Очередь: данных нет</span>
            </div>
          )}

          {/* Time Freshness: Driver mark vs Auto Signal */}
          <div className="text-[10px] sm:text-[11px] text-right ml-auto flex flex-col items-end shrink-0 leading-tight">
            {driverTime && !isSvcOnly ? (
              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span>Водитель: {driverFreshness.diffText}</span>
              </div>
            ) : hasAutoSignal ? (
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span>Отметок водителей нет</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span>{driverFreshness.diffText}</span>
              </div>
            )}
            {hasAutoSignal && autoTime && (
              <span
                className="text-[10px] text-teal-400/90 flex items-center gap-0.5 mt-0.5 font-medium"
                title="На этой заправке прошла оплата (автоматический сигнал), наличие АИ-95 не гарантировано водителем"
              >
                <span>⚡ Заправка работала: {autoFreshness.diffText}</span>
              </span>
            )}
          </div>
        </div>

        {/* Svc Only Warning: Unconfirmed fuel notice */}
        {isSvcOnly && (
          <div className="flex items-start gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-amber-300/90 text-[11px] leading-snug">
            <span className="shrink-0 mt-0.5">ℹ️</span>
            <span>Только автосигнал оплаты терминала. Наличие АИ-95 водителями не подтверждалось.</span>
          </div>
        )}

        {/* Limits alert if specified */}
        {limit && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Лимит: {limit}</span>
          </div>
        )}

        {/* Detail string summary if contains extra notes */}
        {sanitizedDetail && (
          <p className="text-[11px] text-slate-400 line-clamp-2 border-t border-slate-800/60 pt-1.5 mt-1 leading-relaxed">
            {sanitizedDetail}
          </p>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="space-y-1.5 pt-0.5">
        {/* Main Route Button - Full Width */}
        <a
          href={yandexUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-950/60 active:scale-[0.98] transition-all"
          title="Открыть маршрут на авто с учетом пробок в Яндекс Картах"
        >
          <span className="text-sm">🧭</span>
          <span>Маршрут на авто (Яндекс с пробками)</span>
        </a>

        {/* Secondary Links: 2GIS and GdeBenz */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={twoGisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
            title="Открыть в 2ГИС"
          >
            <span className="text-sm">🗺</span>
            <span>2ГИС</span>
          </a>

          <a
            href={gdebenzUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
            title="Открыть карточку станции на ГдеБЕНЗ"
          >
            <span className="text-sm">🌐</span>
            <span>ГдеБЕНЗ</span>
          </a>
        </div>
      </div>
    </article>
  );
};
