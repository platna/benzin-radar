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
  PauseCircle,
  Navigation
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

  const driverTime = !isSvcOnly ? (station.last_driver_at || station.last_at) : null;
  const autoTime = isSvcOnly ? (station.last_auto_at || station.last_at) : null;

  const driverFreshness = getFreshnessText(driverTime || undefined);
  const autoFreshness = getFreshnessText(autoTime || undefined);
  const generalFreshness = getFreshnessText(station.last_at || undefined);
  const { yandexUrl, twoGisUrl, gdebenzUrl } = getNavigationUrls(station);

  const confidencePct = calculateWhereBenzConfidence(
    station.confidence_base,
    driverTime || undefined
  );

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
    statusBannerClass = 'bg-rose-500/15 text-rose-300 border-rose-500/40';
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

  const fuelsInfo = getStationFuelsInfo(station);

  let sourceBadge = null;
  if (fuelsInfo.text !== 'нет свежих отметок' && fuelsInfo.text !== 'нет топлива') {
    if (fuelsInfo.label === 'по последней отметке') {
      sourceBadge = 'по отметке';
    } else if (fuelsInfo.label === 'актуально сегодня') {
      sourceBadge = 'сегодня';
    } else if (fuelsInfo.label === 'по паспорту АЗС') {
      sourceBadge = 'паспорт';
    }
  }

  return (
    <article className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5 rounded-2xl p-3 sm:p-4 shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Верхний ряд: Бренд и статус наличия */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border ${brandInfo.accentBg} ${brandInfo.badgeBorder}`}
            >
              {brandInfo.type === 'lukoil' ? (
                <span className="font-black text-xs sm:text-sm tracking-tighter text-red-400">ЛК</span>
              ) : brandInfo.type === 'gpn' ? (
                <span className="font-black text-xs sm:text-sm tracking-tighter text-sky-400">ГПН</span>
              ) : brandInfo.type === 'teboil' ? (
                <span className="font-black text-xs sm:text-sm tracking-tighter text-amber-400">TB</span>
              ) : (
                <Fuel className="w-4 h-4 text-slate-400" />
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {station.name || brandInfo.displayName}
            </h3>
          </div>

          <div
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border tracking-wide shadow-xs ${statusBannerClass}`}
          >
            {statusIcon}
            <span>{statusText}</span>
          </div>
        </div>

        {/* Адрес */}
        <div className="flex items-start gap-1.5 text-xs text-slate-300 mb-2 leading-snug">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500 mt-0.5" />
          <span className="break-words font-medium">{station.addr || station.address || 'Нижний Новгород'}</span>
        </div>

        {/* Бейджи: 95+, Расстояние от водителя, Евро-5, Уверенность */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
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
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
              АИ-95: нет
            </span>
          )}

          {/* Бейдж расстояния по GPS */}
          {typeof station.distance_km === 'number' && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30"
              title="Расстояние от вашего местоположения"
            >
              <Navigation className="w-2.5 h-2.5 text-blue-400 shrink-0" />
              <span>{station.distance_km.toFixed(1)} км</span>
            </span>
          )}

          {getFuelClass(station) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80">
              <Award className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{getFuelClass(station)}</span>
            </span>
          )}

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

        {/* Информационный блок: Очередь, Время, Доступные виды топлива */}
        <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/90 mb-3 space-y-2 text-xs">
          {/* Ряд 1: Очередь (слева) и Время отметки (справа) */}
          <div className="flex items-center justify-between gap-1.5">
            {queueTraffic ? (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] shrink-0 ${queueBadgeClass}`}>
                <span>{queueTraffic.icon}</span>
                <span className="font-medium">{queueTraffic.text}</span>
              </div>
            ) : fuelInfo.state === 'queue' ? (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] shrink-0 bg-amber-500/10 text-amber-300 border-amber-500/30">
                <span>🟡</span>
                <span className="font-medium">Очередь</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-slate-500 text-[11px] shrink-0">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Очередь: данных нет</span>
              </div>
            )}

            {/* Время отметки водителя (компактно, никогда не вылезает за край) */}
            <div className="text-[10px] sm:text-[11px] text-right shrink-0">
              {driverTime && !isSvcOnly ? (
                <span className="text-slate-300 inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span>{driverFreshness.diffText}</span>
                  {driverFreshness.timeMsk !== '--:--' && (
                    <span className="text-slate-400 font-normal">({driverFreshness.timeMsk})</span>
                  )}
                </span>
              ) : isSvcOnly && autoTime ? (
                <span className="text-teal-400 font-medium inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 shrink-0" />
                  <span>Авто: {autoFreshness.diffText}</span>
                </span>
              ) : (
                <span className="text-slate-500 inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 shrink-0" />
                  <span>{generalFreshness.diffText}</span>
                </span>
              )}
            </div>
          </div>

          {/* Перерывы и слив бензовоза */}
          {breakInfo && (
            <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] leading-snug">
              <PauseCircle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
              <span>{breakInfo}</span>
            </div>
          )}

          {/* Предупреждение: только другие виды топлива */}
          {!isSvcOnly && !breakInfo && !isExpired && fuelInfo.state === 'none' && (
            <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] leading-snug">
              <span className="shrink-0">ℹ️</span>
              {fuelsInfo.text === 'нет топлива' || station.status === 'no' || station.status === 'empty' ? (
                <span>По отметкам водителей — на этой АЗС сейчас нет топлива.</span>
              ) : (
                <span>По отметкам водителей — бензина АИ-95 нет. В наличии: {fuelsInfo.text}.</span>
              )}
            </div>
          )}

          {/* Предупреждение: пока нет отметок */}
          {!isSvcOnly && !breakInfo && isExpired && (
            <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 text-[11px] leading-snug">
              <span className="shrink-0">⚪</span>
              <span>Пока нет свежих отметок водителей за сегодня.</span>
            </div>
          )}

          {/* Лимиты */}
          {limit && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Лимит: {limit}</span>
            </div>
          )}

          {/* Ряд 2: Виды топлива (БЕЗ ТРОЕТОЧИЙ, всегда видны полностью) */}
          <div className="border-t border-slate-800/80 pt-2 flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 flex-1 min-w-0">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="text-slate-400 font-normal">
                  {isExpired ? 'Виды топлива: ' : 'В наличии: '}
                </span>
                <span className="font-bold text-white tracking-wide break-words">
                  {fuelsInfo.text}
                </span>
              </div>
            </div>

            {sourceBadge && (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 shrink-0 font-medium">
                {sourceBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки навигации (Стильный синий цвет навигатора) */}
      <div className="space-y-1.5">
        <a
          href={yandexUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-950/60 active:scale-[0.98] transition-all cursor-pointer"
          title="Открыть маршрут на авто с пробками в Яндекс Картах"
        >
          <span className="text-sm">🧭</span>
          <span>Маршрут на авто (Яндекс с пробками)</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={twoGisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
            title="Открыть в 2ГИС"
          >
            <span>🗺</span>
            <span>2ГИС</span>
          </a>

          <a
            href={gdebenzUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
            title="Открыть на ГдеБЕНЗ"
          >
            <span>🌐</span>
            <span>ГдеБЕНЗ</span>
          </a>
        </div>
      </div>
    </article>
  );
};