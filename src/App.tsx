import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Station, DistrictTab, FuelStatusFilter } from './types/station';
import {
  isNagornayaWhitelist,
  isLeninskyDistrict,
  check95Fuel,
  isQueueStation,
  GDEBENZ_URL
} from './utils/fuelLogic';
import { FALLBACK_STATIONS } from './data/mockStations';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { DeficitSummary } from './components/DeficitSummary';
import { StationCard } from './components/StationCard';
import { InfoModal } from './components/InfoModal';
import { AlertCircle, RefreshCw, Layers, CheckCircle2, X } from 'lucide-react';

interface ToastNotification {
  id: number;
  type: 'manual' | 'auto';
  title: string;
  message: string;
  time: string;
}

export default function App() {
  // Initialize from recent live cache if available, otherwise authentic fallback stations
  const [stations, setStations] = useState<Station[]>(() => {
    try {
      const cached = localStorage.getItem('cached_live_stations');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return FALLBACK_STATIONS;
  });
  const [currentDistrict, setCurrentDistrict] = useState<DistrictTab>('nagornaya');
  const [activeFilter, setActiveFilter] = useState<FuelStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    try {
      return localStorage.getItem('cached_live_time') || 'только что';
    } catch {
      return 'только что';
    }
  });
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const isFirstLoadRef = useRef(true);

  // Auto-dismiss toast after 4.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

const loadStations = useCallback(async (showIndicator = true, isManual = false) => {
    if (showIndicator) setIsRefreshing(true);
    let fetched = false;

    const getNowMsk = () => {
      try {
        return new Intl.DateTimeFormat('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date());
      } catch {
        return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      }
    };

    const currentMsk = getNowMsk();

    try {
      // Прямой запрос к вашему надежному Google Script серверу
      const res = await fetch(`${GOOGLE_SCRIPT_API_URL}?_t=${Date.now()}`, {
        redirect: 'follow',
        signal: AbortSignal.timeout(12000)
      });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.stations;
        if (Array.isArray(list) && list.length > 0) {
          setStations(list);
          setIsLiveApi(true);
          setLastUpdatedTime(`МСК ${currentMsk}`);
          fetched = true;
          try {
            localStorage.setItem('cached_live_stations', JSON.stringify(list));
            localStorage.setItem('cached_live_time', `МСК ${currentMsk}`);
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Сбой загрузки данных:', e);
    }

    if (!isFirstLoadRef.current || isManual) {
      setToast({
        id: Date.now(),
        type: fetched ? (isManual ? 'manual' : 'auto') : 'auto',
        title: fetched ? 'Данные успешно обновлены' : 'Ошибка обновления',
        message: fetched
          ? 'Синхронизированы оба района: 17 Нагорная + 11 Ленинский'
          : 'Не удалось получить свежие данные. Показаны данные из памяти.',
        time: `МСК ${currentMsk}`
      });
    }

    if (isFirstLoadRef.current) isFirstLoadRef.current = false;
    if (showIndicator) setTimeout(() => setIsRefreshing(false), 400);
  }, []);

  // Initial load & automatic refresh every 5 minutes
  useEffect(() => {
    loadStations(false, false);

    const interval = setInterval(() => {
      loadStations(false, false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadStations]);

  // Canonical lists: strictly 17 stations for Nagornaya, strictly 11 stations for Leninsky
  const canonicalNagornaya = useMemo(() => FALLBACK_STATIONS.filter(isNagornayaWhitelist), []);
  const canonicalLeninsky = useMemo(() => FALLBACK_STATIONS.filter(isLeninskyDistrict), []);

  // Вспомогательная функция очистки адреса для надежного сравнения
  const cleanA = (a?: string) => (a || '').toLowerCase().replace(/[\.\,\s\-]/g, '');

  const nagornayaAll = useMemo(() => {
    return canonicalNagornaya.map((canon) => {
      const live = stations.find((s) => {
        if (s.osm_id && canon.osm_id && String(s.osm_id) === String(canon.osm_id)) return true;
        const c1 = cleanA(s.addr || s.address);
        const c2 = cleanA(canon.addr || canon.address);
        return Boolean(c1 && c2 && (c1.includes(c2) || c2.includes(c1)));
      });
      if (!live) return canon;
      const hasDriverFuel = Boolean((live.detail && live.detail.trim().length > 0) || (live.fuels_now && live.fuels_now.trim().length > 0));
      const effectiveSvc = hasDriverFuel ? null : (live.svc !== undefined ? live.svc : null);
      return {
        ...canon,
        ...live,
        svc: effectiveSvc,
        name: live.name || canon.name,
        brand: live.brand || canon.brand,
        addr: live.addr || canon.addr,
        lat: live.lat ?? canon.lat,
        lon: live.lon ?? canon.lon,
        meta: live.meta || canon.meta
      };
    });
  }, [canonicalNagornaya, stations]);

  const leninskyAll = useMemo(() => {
    return canonicalLeninsky.map((canon) => {
      const live = stations.find((s) => {
        if (s.osm_id && canon.osm_id && String(s.osm_id) === String(canon.osm_id)) return true;
        const c1 = cleanA(s.addr || s.address);
        const c2 = cleanA(canon.addr || canon.address);
        return Boolean(c1 && c2 && (c1.includes(c2) || c2.includes(c1)));
      });
      if (!live) return canon;
      const hasDriverFuel = Boolean((live.detail && live.detail.trim().length > 0) || (live.fuels_now && live.fuels_now.trim().length > 0));
      const effectiveSvc = hasDriverFuel ? null : (live.svc !== undefined ? live.svc : null);
      return {
        ...canon,
        ...live,
        svc: effectiveSvc,
        name: live.name || canon.name,
        brand: live.brand || canon.brand,
        addr: live.addr || canon.addr,
        lat: live.lat ?? canon.lat,
        lon: live.lon ?? canon.lon,
        meta: live.meta || canon.meta
      };
    });
  }, [canonicalLeninsky, stations]);

  // Calculate deficit statistics for Nagornaya (strictly out of 17)
  const nagornayaStats = useMemo(() => {
    let available = 0;
    let free = 0;
    let queue = 0;

    nagornayaAll.forEach((s) => {
      const fuel = check95Fuel(s);
      if (fuel.state !== 'none') {
        available++;
        if (isQueueStation(s)) {
          queue++;
        } else {
          free++;
        }
      }
    });

    const total = 17;
    return { total, available, free, queue, empty: Math.max(0, total - available) };
  }, [nagornayaAll]);

  // Calculate deficit statistics for Leninsky (strictly out of 11)
  const leninskyStats = useMemo(() => {
    let available = 0;
    let free = 0;
    let queue = 0;

    leninskyAll.forEach((s) => {
      const fuel = check95Fuel(s);
      if (fuel.state !== 'none') {
        available++;
        if (isQueueStation(s)) {
          queue++;
        } else {
          free++;
        }
      }
    });

    const total = 11;
    return { total, available, free, queue, empty: Math.max(0, total - available) };
  }, [leninskyAll]);

  // Current active district stations
  const activeDistrictList = currentDistrict === 'nagornaya' ? nagornayaAll : leninskyAll;
  const currentStats = currentDistrict === 'nagornaya' ? nagornayaStats : leninskyStats;

  // Filtered and searched stations
  const displayedStations = useMemo(() => {
    return activeDistrictList.filter((s) => {
      const fuel = check95Fuel(s);
      const brand = (s.brand || s.name || '').toLowerCase();
      const addr = (s.addr || s.address || '').toLowerCase();

      // Brand / status filter
      if (activeFilter === 'available_only') {
        if (fuel.state === 'none') return false;
      } else if (activeFilter === 'no_queue') {
        if (fuel.state === 'none') return false;
        if (isQueueStation(s)) return false;
      } else if (activeFilter === 'lukoil') {
        if (brand.indexOf('лукойл') === -1 && brand.indexOf('lukoil') === -1) return false;
      } else if (activeFilter === 'gpn') {
        if (brand.indexOf('газпром') === -1 && brand.indexOf('gazprom') === -1) return false;
      } else if (activeFilter === 'teboil') {
        if (brand.indexOf('teboil') === -1 && brand.indexOf('тебойл') === -1) return false;
      }
      // Note: when activeFilter === 'all', all stations are displayed

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAddr = addr.includes(q);
        const matchesBrand = brand.includes(q);
        const matchesName = (s.name || '').toLowerCase().includes(q);
        if (!matchesAddr && !matchesBrand && !matchesName) return false;
      }

      return true;
    }).sort((a, b) => {
      // Prioritize free available stations first (0), then queue stations (1), then empty stations (2)
      const aFuel = check95Fuel(a);
      const bFuel = check95Fuel(b);
      const aScore = aFuel.state === 'none' ? 2 : isQueueStation(a) ? 1 : 0;
      const bScore = bFuel.state === 'none' ? 2 : isQueueStation(b) ? 1 : 0;
      return aScore - bScore;
    });
  }, [activeDistrictList, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Application Bar */}
      <Header
        lastUpdatedTime={lastUpdatedTime}
        isRefreshing={isRefreshing}
        onRefresh={() => loadStations(true, true)}
        isLiveApi={isLiveApi}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Main Content Area: Mobile-optimised, gracefully expands to 2 columns on tablet/desktop */}
      <main className="flex-1 w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* District Switcher Tabs and Quick Filters */}
        <Tabs
          currentDistrict={currentDistrict}
          onSelectDistrict={(tab) => {
            setCurrentDistrict(tab);
            setSearchQuery('');
          }}
          nagornayaAvailableCount={nagornayaStats.available}
          nagornayaTotalCount={nagornayaStats.total}
          leninskyAvailableCount={leninskyStats.available}
          leninskyTotalCount={leninskyStats.total}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Deficit Summary Gauge Card */}
        <DeficitSummary
          districtTitle={currentDistrict === 'nagornaya' ? 'Нагорная часть' : 'Ленинский район'}
          totalStations={currentStats.total}
          availableCount={currentStats.available}
          freeCount={currentStats.free}
          queueCount={currentStats.queue}
          emptyCount={currentStats.empty}
        />

        {/* Section Heading & Result Count */}
        <div className="flex items-center justify-between text-xs px-1 text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Список АЗС ({displayedStations.length}
              {displayedStations.length !== activeDistrictList.length && ` из ${activeDistrictList.length}`})
            </span>
          </div>

          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="text-[11px] text-emerald-400 hover:underline"
            >
              Сбросить фильтр
            </button>
          )}
        </div>

        {/* Station Cards List: 1 col on mobile, 2 cols on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-8" data-testid="station-list">
          {displayedStations.length > 0 ? (
            displayedStations.map((station) => (
              <StationCard
                key={station.id || station.osm_id || `${station.lat}_${station.lon}`}
                station={station}
              />
            ))
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3 my-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Ничего не найдено</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                По текущим параметрам фильтрации заправок не найдено. Попробуйте сбросить фильтры или изменить поисковый запрос.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700"
              >
                Показать все АЗС
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Toast Notification for manual and automatic updates */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto sm:min-w-[360px] max-w-md bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                toast.type === 'manual'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}
            >
              {toast.type === 'manual' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4 animate-spin" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {toast.title}
                </h4>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  {toast.time}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Закрыть уведомление"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-[11px] text-slate-400">
        <p className="max-w-md mx-auto">
          Бензин Радар НН v2.0 · Оперативный мониторинг наличия АИ-95, очередей и лимитов на АЗС Нижнего Новгорода
        </p>
      </footer>
    </div>
  );
}
