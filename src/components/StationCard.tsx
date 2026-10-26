import React from 'react';
import { Station } from '../types/station';
import {
  check95Fuel,
  isQueueStation,
  formatQueueTrafficLight,
  parseLimit,
  parseBreak,
  cleanDetailFuels,
  getStationFuelsInfo,
  getFreshnessText,
  getBrandInfo,
  getNavigationUrls,
  calculateWhereBenzConfidence,
  isMarkExpired,
  getFuelClass
} from '../utils/fuelLogic';
import {
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  Fuel,
  AlertTriangle,
  PauseCircle
} from 'lucide-react';

interface StationCardProps {
  station: Station;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const brandInfo = getBrandInfo(station.brand, station.name);
  const fuelInfo = check95Fuel(station);
  const queueTraffic = formatQueueTrafficLight(station.detail);
  const limit = parseLimit(station.detail);
  const breakInfo = parseBreak(station.detail);

  const hasDriverFuelDetail = Boolean(station.detail && cleanDetailFuels(station.detail));
  const hasDriverFuelsNow = Boolean(station.fuels_now && station.fuels_now.trim().length > 0);
  const isSvcOnly = (station.svc === 'only' || Boolean(station.svc_only)) && !hasDriverFuelDetail && !hasDriverFuelsNow;

  // Single source of truth for driver timestamp
  const driverTime = !isSvcOnly ? (station.last_driver_at || station.last_at) : null;
  // Automated transaction terminal timestamp ONLY for cashless terminal stations
  const autoTime = isSvcOnly ? (station.last_auto_at || station.last_at) : null;

  const driverFreshness = getFreshnessText(driverTime || undefined);
  const autoFreshness = getFreshnessText(autoTime || undefined);
  const generalFreshness = getFreshnessText(station.last_at || undefined);
  const { yandexUrl, twoGisUrl, gdebenzUrl } = getNavigationUrls(station);

  // Exact WhereBenz confidence with time decay based on driver confirmation
  const confidencePct = calculateWhereBenzConfidence(
    station.confidence_base,
    driverTime || undefined
  );

  // Status plate styling: distinguishes 'АИ-95 В НАЛИЧИИ', 'АИ-95 · ОЧЕРЕДЬ', and 'НЕТ АИ-95'
  const isHeavyQueue = isQueueStation(station);

  const isExpired = !station.status || isMarkExpired(station);

  let statusBannerClass = '';
  let statusText = '';
  let statusIcon = null;

  if (isSvcOnly) {
    statusBannerClass = 'bg-teal-500/15 text-teal-300 border-teal-500/40';
    statusText = 'ТОЛЬКО ТЕРМИНАЛ';
    statusIcon = <span className="w-2 h-2 rounded-full bg-teal-400" />;
  } else if (isExpired) {
    statusBannerClass = 'bg-slate-800/80 text-slate-400 border-slate-700/60';
    statusText = 'ПОКА НЕТ ОТМЕТОК';
    statusIcon = <span className="w-2 h-2 rounded-full bg-slate-500" />;
  } else if (fuelInfo.state === 'none') {
    statusBannerClass = 'bg-slate-800/80 text-slate-400 border-slate-700/60';
    statusText = 'НЕТ АИ-95';
    statusIcon = <span className="w-2 h-2 rounded-full bg-rose-500" />;
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

  // Fuel types information (live confirmed or historical from meta/last mark)
  const fuelsInfo = getStationFuelsInfo(station);

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
        {/* Specific Fuel Badge: 95 Экто / 95 G-Drive / АИ-95 / АИ-95: нет */}
        {fuelInfo.has95Plus ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
            <span>✨</span>
            <span>{brandInfo.premiumFuelName}</span>
          </span>
        ) : fuelInfo.has95 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            АИ-95
          </span>
        ) : !station.status ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800/90 text-slate-400 border border-slate-700/80">
            АИ-95: нет отметок
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800/90 text-slate-400 border border-slate-700/80">
            АИ-95: нет
          </span>
        )}

        {/* Euro-5 / K5 Class — только если реально отмечен на ГдеБЕНЗ */}
        {getFuelClass(station) && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80">
            <Award className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{getFuelClass(station)}</span>
          </span>
        )}

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
      <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/90 mb-3 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
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
          ) : (
            <div className="inline-flex items-center gap-1 text-slate-500 text-[11px] sm:text-xs shrink-0">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Очередь: данных нет</span>
            </div>
          )}

          {/* Time Freshness: Driver mark or automated terminal if cashless only */}
          <div className="text-[10px] sm:text-[11px] text-right ml-auto flex flex-col items-end shrink-0 max-w-[65%] leading-tight">
            {driverTime && !isSvcOnly ? (
              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span>
                  Водитель: {driverFreshness.diffText}
                  {driverFreshness.timeMsk !== '--:--' && (
                    <span className="text-slate-400 font-normal ml-1">({driverFreshness.timeMsk})</span>
                  )}
                </span>
              </div>
            ) : isSvcOnly && autoTime ? (
              <div className="flex flex-col items-end text-teal-400 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-teal-400 shrink-0" />
                  <span>
                    ⚡ Заправка работала: {autoFreshness.diffText}
                    {autoFreshness.timeMsk !== '--:--' && (
                      <span className="text-teal-400/80 font-normal ml-1">({autoFreshness.timeMsk})</span>
                    )}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5">
                  (отметок водителей нет)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span>
                  {generalFreshness.diffText}
                  {generalFreshness.timeMsk !== '--:--' && (
                    <span className="text-slate-500 font-normal ml-1">({generalFreshness.timeMsk})</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Break / Unloading alert badge if driver noted a pause */}
        {breakInfo && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-medium">
            <PauseCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{breakInfo}</span>
          </div>
        )}

        {/* Break notice text */}
        {breakInfo && (
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] leading-snug">
            <span className="shrink-0 mt-0.5">⏸️</span>
            <span>Водитель отметил перерыв (слив бензовоза). Во время слива отпуск бензина приостановлен.</span>
          </div>
        )}

        {/* Driver reported only other fuels or confirmed no fuel */}
        {!isSvcOnly && !breakInfo && !isExpired && fuelInfo.state === 'none' && fuelsInfo.source === 'live' && (
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-300 text-[11px] leading-snug">
            <span className="shrink-0 mt-0.5">ℹ️</span>
            {fuelsInfo.text === 'нет топлива' || station.status === 'no' || station.status === 'empty' ? (
              <span>По отметкам водителей — на этой АЗС сейчас нет топлива.</span>
            ) : !(/(?:^|[^\d])95(?:\+|plus)?(?:[^\d]|$)/i.test(fuelsInfo.text) || /95\+/i.test(fuelsInfo.text)) ? (
              <span>По отметкам водителей — в наличии только {fuelsInfo.text}. Бензина АИ-95 нет.</span>
            ) : (
              <span>По отметкам водителей — отпуск топлива приостановлен.</span>
            )}
          </div>
        )}

        {/* Svc Only Warning: Unconfirmed fuel notice */}
        {isSvcOnly && (
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300/90 text-[11px] leading-snug">
            <span className="shrink-0 mt-0.5">ℹ️</span>
            <span>Только автосигнал оплаты терминала. Наличие АИ-95 водителями не подтверждалось.</span>
          </div>
        )}

        {/* Unconfirmed / No marks notice (Photo 11: "Пока нет отметок") */}
        {!isSvcOnly && !breakInfo && isExpired && (
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 text-[11px] leading-snug">
            <span className="shrink-0 mt-0.5">⚪</span>
            <span>Пока нет свежих отметок водителей. Станьте первым, кто сообщит ситуацию на ГдеБЕНЗ.</span>
          </div>
        )}

        {/* Limits alert if specified */}
        {limit && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Лимит: {limit}</span>
          </div>
        )}

        {/* Fuel types row: Always visible, clearly rendered beneath any notices */}
        <div className="border-t border-slate-800/80 pt-2 mt-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-200 tracking-wide truncate">
              {fuelsInfo.text === 'нет топлива' || station.status === 'no' || station.status === 'empty' ? (
                <span>
                  <span className="text-slate-400 font-normal">Статус: </span>
                  <span className="text-rose-400 font-semibold">топлива нет</span>
                </span>
              ) : isExpired ? (
                <span>
                  <span className="text-slate-400 font-normal">Виды топлива: </span>
                  <span className="text-slate-200">{fuelsInfo.text}</span>
                </span>
              ) : fuelInfo.state === 'none' && !(/(?:^|[^\d])95(?:\+|plus)?(?:[^\d]|$)/i.test(fuelsInfo.text) || /95\+/i.test(fuelsInfo.text)) ? (
                <span>
                  <span className="text-slate-400 font-normal">В наличии: </span>
                  <span className="text-white">{fuelsInfo.text}</span>{' '}
                  <span className="text-rose-400 font-normal">· АИ-95 нет</span>
                </span>
              ) : (
                <span>
                  <span className="text-slate-400 font-normal">В наличии: </span>
                  <span className="text-white">{fuelsInfo.text}</span>
                </span>
              )}
            </span>
          </div>
          {fuelsInfo.label && fuelsInfo.text !== 'нет свежих отметок' && (
            <span className="text-[10px] text-slate-500 shrink-0 ml-2 font-normal">
              {fuelsInfo.label}
            </span>
          )}
        </div>
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
