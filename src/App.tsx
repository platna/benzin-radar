import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Station, DistrictTab, FuelStatusFilter } from './types/station';
import {
  isNagornayaWhitelist,
  isLeninskyDistrict,
  check95Fuel,
  isQueueStation,
  GOOGLE_SCRIPT_API_URL
} from './utils/fuelLogic';
import { TARGET_STATIONS_NN } from './data/mockStations';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { DeficitSummary } from './components/DeficitSummary';
import { StationCard } from './components/StationCard';
import { InfoModal } from './components/InfoModal';
import { AlertCircle, RefreshCw, Layers, CheckCircle2, X, Navigation, Sparkles } from 'lucide-react';

interface ToastNotification {
  id: number;
  type: 'manual' | 'auto';
  title: string;
  message: string;
  time: string;
}

interface UserCoords {
  lat: number;
  lon: number;
}

const PULL_THRESHOLD = 70;

// ВЕРСИЯ ОБНОВЛЕНИЯ (поменяй на '2.2' в будущем, чтобы снова показать окно всем 1 раз)
const CHANGELOG_VERSION = '2.2';
const CHANGELOG_STORAGE_KEY = 'benzin_seen_changelog_version';

// Формула Гаверсинуса для точного расчета расстояния в километрах
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function App() {
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
    return TARGET_STATIONS_NN;
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

  // Состояние окна «Что нового» (показывается только 1 раз для текущей версии)
  const [isChangelogOpen, setIsChangelogOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CHANGELOG_STORAGE_KEY) !== CHANGELOG_VERSION;
    } catch {
      return false;
    }
  });

  const handleCloseChangelog = () => {
    setIsChangelogOpen(false);
    try {
      localStorage.setItem(CHANGELOG_STORAGE_KEY, CHANGELOG_VERSION);
    } catch {}
  };

  // Умная гибридная геолокация с памятью
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const hasAutoSwitchedDistrictRef = useRef<boolean>(false);

  // Для жеста Pull-to-refresh
  const [pullOffset, setPullOffset] = useState<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const requestGeolocation = useCallback((silent = false) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      if (!silent) {
        setToast({
          id: Date.now(),
          type: 'auto',
          title: 'Геолокация недоступна',
          message: 'Ваш браузер не поддерживает определение GPS-координат.',
          time: 'GPS'
        });
      }
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords({ lat, lon });
        setIsLocating(false);

        try {
          localStorage.setItem('benzin_geo_enabled', 'true');
        } catch {}

        if (!hasAutoSwitchedDistrictRef.current) {
          hasAutoSwitchedDistrictRef.current = true;
          const distToLeninsky = getDistanceKm(lat, lon, 56.28, 43.92);
          const distToNagornaya = getDistanceKm(lat, lon, 56.29, 44.03);

          if (distToLeninsky < distToNagornaya) {
            setCurrentDistrict('leninsky');
          } else {
            setCurrentDistrict('nagornaya');
          }
        }

        if (!silent) {
          setToast({
            id: Date.now(),
            type: 'manual',
            title: 'Геопоиск включен',
            message: 'АЗС с бензином отсортированы от самой близкой к вам!',
            time: '📍 GPS'
          });
        }
      },
      () => {
        setIsLocating(false);
        try {
          localStorage.removeItem('benzin_geo_enabled');
        } catch {}
        if (!silent) {
          setToast({
            id: Date.now(),
            type: 'auto',
            title: 'Доступ к GPS отклонен',
            message: 'Разрешите доступ к геопозиции в настройках браузера.',
            time: 'GPS'
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const toggleGeolocation = () => {
    if (userCoords) {
      setUserCoords(null);
      try {
        localStorage.removeItem('benzin_geo_enabled');
      } catch {}
      setToast({
        id: Date.now(),
        type: 'auto',
        title: 'Геопоиск отключен',
        message: 'Возвращена стандартная сортировка списка.',
        time: 'GPS'
      });
    } else {
      requestGeolocation(false);
    }
  };

  useEffect(() => {
    try {
      if (localStorage.getItem('benzin_geo_enabled') === 'true') {
        requestGeolocation(true);
      }
    } catch {}
  }, [requestGeolocation]);

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
      // Напрямую запрашиваем наш Google-скрипт (работает в РФ без ВПН на любом хостинге!)
      const res = await fetch(`${GOOGLE_SCRIPT_API_URL}?_t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.stations;
        if (Array.isArray(list) && list.length > 0) {
          setStations(list);
          setIsLiveApi(true);
          setLastUpdatedTime(`МСК ${currentMsk}`);
          fetched = true;
          lastFetchTimeRef.current = Date.now();
          try {
            localStorage.setItem('cached_live_stations', JSON.stringify(list));
            localStorage.setItem('cached_live_time', `МСК ${currentMsk}`);
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Сбой загрузки данных:', e);
    }

    setToast({
      id: Date.now(),
      type: fetched ? (isManual ? 'manual' : 'auto') : 'auto',
      title: fetched ? 'Данные успешно обновлены' : 'Ошибка обновления',
      message: fetched
        ? 'Синхронизированы оба района: 17 Нагорная + 11 Ленинский'
        : 'Показаны последние сохраненные данные.',
      time: `МСК ${currentMsk}`
    });

    if (showIndicator) setTimeout(() => setIsRefreshing(false), 400);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      isPullingRef.current = true;
    } else {
      isPullingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || isRefreshing) return;
    if (window.scrollY > 0) {
      isPullingRef.current = false;
      setPullOffset(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - touchStartY.current;
    const deltaX = Math.abs(currentX - touchStartX.current);

    if (deltaX > deltaY) {
      isPullingRef.current = false;
      setPullOffset(0);
      return;
    }

    if (deltaY > 0) {
      const damped = Math.min(100, Math.pow(deltaY, 0.85) * 2.2);
      setPullOffset(damped);
    } else {
      setPullOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    if (pullOffset >= PULL_THRESHOLD && !isRefreshing) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(20);
        } catch {}
      }
      loadStations(true, true);
    }
    setPullOffset(0);
  };

  useEffect(() => {
    loadStations(false, true);

    const interval = setInterval(() => {
      loadStations(false, false);
    }, 5 * 60 * 1000);

    const handleResume = () => {
      if (document.visibilityState === 'visible') {
        const secondsSinceLast = (Date.now() - lastFetchTimeRef.current) / 1000;
        if (secondsSinceLast > 60) {
          loadStations(true, true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('focus', handleResume);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, [loadStations]);

  const canonicalNagornaya = useMemo(() => TARGET_STATIONS_NN.filter(isNagornayaWhitelist), []);
  const canonicalLeninsky = useMemo(() => TARGET_STATIONS_NN.filter(isLeninskyDistrict), []);

  const mergeStationData = useCallback((canon: Station): Station => {
    const live = stations.find((s) => {
      if (s.osm_id && canon.osm_id && String(s.osm_id) === String(canon.osm_id)) return true;
      if (s.id && canon.osm_id && String(s.id) === String(canon.osm_id)) return true;

      const sBrand = (s.brand || s.name || '').toLowerCase();
      const cBrand = (canon.brand || canon.name || '').toLowerCase();
      const sameBrand = (sBrand.includes('лукойл') && cBrand.includes('лукойл')) ||
                        (sBrand.includes('teboil') && cBrand.includes('teboil')) ||
                        (sBrand.includes('газпром') && cBrand.includes('газпром'));

      if (!sameBrand) return false;

      const cleanA = (a?: string) => (a || '').toLowerCase().replace(/[^0-9а-яa-z]/gi, '');
      const a1 = cleanA(s.addr || s.address);
      const a2 = cleanA(canon.addr || canon.address);

      return Boolean(a1 && a2 && (a1.includes(a2) || a2.includes(a1)));
    });

    const distance_km = userCoords
      ? getDistanceKm(userCoords.lat, userCoords.lon, canon.lat, canon.lon)
      : undefined;

    if (!live) {
      return { ...canon, distance_km };
    }

    return {
      ...canon,
      status: live.status || canon.status || "yes",
      conflict: live.conflict,
      dt_only: live.dt_only,
      fuels_now: live.fuels_now || canon.fuels_now,
      detail: live.detail || canon.detail,
      last_driver_at: live.last_driver_at || live.last_at || canon.last_driver_at,
      last_at: live.last_at || live.last_driver_at || canon.last_at,
      confidence_base: live.confidence_base !== undefined ? live.confidence_base : canon.confidence_base,
      price: live.price || canon.price,
      distance_km
    };
  }, [stations, userCoords]);

  const nagornayaAll = useMemo(() => canonicalNagornaya.map(mergeStationData), [canonicalNagornaya, mergeStationData]);
  const leninskyAll = useMemo(() => canonicalLeninsky.map(mergeStationData), [canonicalLeninsky, mergeStationData]);

  const nagornayaStats = useMemo(() => {
    let available = 0;
    let free = 0;
    let queue = 0;

    nagornayaAll.forEach((s) => {
      const fuel = check95Fuel(s);
      if (fuel.state !== 'none') {
        available++;
        if (isQueueStation(s)) queue++;
        else free++;
      }
    });

    const total = 17;
    return { total, available, free, queue, empty: Math.max(0, total - available) };
  }, [nagornayaAll]);

  const leninskyStats = useMemo(() => {
    let available = 0;
    let free = 0;
    let queue = 0;

    leninskyAll.forEach((s) => {
      const fuel = check95Fuel(s);
      if (fuel.state !== 'none') {
        available++;
        if (isQueueStation(s)) queue++;
        else free++;
      }
    });

    const total = 11;
    return { total, available, free, queue, empty: Math.max(0, total - available) };
  }, [leninskyAll]);

  const activeDistrictList = currentDistrict === 'nagornaya' ? nagornayaAll : leninskyAll;
  const currentStats = currentDistrict === 'nagornaya' ? nagornayaStats : leninskyStats;

  const displayedStations = useMemo(() => {
    return activeDistrictList.filter((s) => {
      const fuel = check95Fuel(s);
      const brand = (s.brand || s.name || '').toLowerCase();
      const addr = (s.addr || s.address || '').toLowerCase();

      if (activeFilter === 'available_only') {
        if (fuel.state === 'none') return false;
      } else if (activeFilter === 'no_queue') {
        if (fuel.state === 'none') return false;
        if (isQueueStation(s)) return false;
      } else if (activeFilter === 'lukoil') {
        if (!brand.includes('лукойл') && !brand.includes('lukoil')) return false;
      } else if (activeFilter === 'gpn') {
        if (!brand.includes('газпром') && !brand.includes('gazprom')) return false;
      } else if (activeFilter === 'teboil') {
        if (!brand.includes('teboil') && !brand.includes('тебойл')) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAddr = addr.includes(q);
        const matchesBrand = brand.includes(q);
        const matchesName = (s.name || '').toLowerCase().includes(q);
        if (!matchesAddr && !matchesBrand && !matchesName) return false;
      }

      return true;
    }).sort((a, b) => {
      const aFuel = check95Fuel(a);
      const bFuel = check95Fuel(b);
      const aScore = aFuel.state === 'none' ? 2 : isQueueStation(a) ? 1 : 0;
      const bScore = bFuel.state === 'none' ? 2 : isQueueStation(b) ? 1 : 0;

      if (aScore !== bScore) {
        return aScore - bScore;
      }

      if (typeof a.distance_km === 'number' && typeof b.distance_km === 'number') {
        return a.distance_km - b.distance_km;
      }

      return 0;
    });
  }, [activeDistrictList, activeFilter, searchQuery]);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Плашка индикатора жеста Pull-to-refresh */}
      <div
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 pointer-events-none"
        style={{
          transform: `translate(-50%, ${pullOffset > 0 ? pullOffset - 15 : isRefreshing ? 55 : -70}px)`,
          opacity: pullOffset > 0 || isRefreshing ? 1 : 0
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-emerald-500/40 shadow-xl shadow-black/80 text-xs font-semibold text-emerald-300 backdrop-blur-md">
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              isRefreshing
                ? 'animate-spin text-emerald-400'
                : pullOffset >= PULL_THRESHOLD
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
            style={
              !isRefreshing
                ? { transform: `rotate(${Math.min(360, pullOffset * 4)}deg)` }
                : undefined
            }
          />
          <span>
            {isRefreshing
              ? 'Обновление данных...'
              : pullOffset >= PULL_THRESHOLD
              ? 'Отпустите для обновления'
              : 'Потяните для обновления'}
          </span>
        </div>
      </div>

      <Header
        lastUpdatedTime={lastUpdatedTime}
        isRefreshing={isRefreshing}
        onRefresh={() => loadStations(true, true)}
        isLiveApi={isLiveApi}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      <main className="flex-1 w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
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

        <DeficitSummary
          districtTitle={currentDistrict === 'nagornaya' ? 'Нагорная часть' : 'Ленинский район'}
          totalStations={currentStats.total}
          availableCount={currentStats.available}
          freeCount={currentStats.free}
          queueCount={currentStats.queue}
          emptyCount={currentStats.empty}
        />

        {/* Панель управления списком и Умная кнопка Геолокации */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1 text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Список АЗС ({displayedStations.length}
              {displayedStations.length !== activeDistrictList.length && ` из ${activeDistrictList.length}`})
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {activeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="text-[11px] text-emerald-400 hover:underline cursor-pointer mr-1"
              >
                Сбросить фильтр
              </button>
            )}

            <button
              type="button"
              onClick={toggleGeolocation}
              disabled={isLocating}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                userCoords
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-950/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title={userCoords ? 'Нажмите, чтобы отключить сортировку по GPS' : 'Найти ближайшие ко мне АЗС с бензином'}
            >
              <Navigation className={`w-3.5 h-3.5 ${userCoords ? 'text-blue-400 fill-blue-400/20' : isLocating ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
              <span>
                {isLocating
                  ? 'Поиск GPS...'
                  : userCoords
                  ? 'Рядом со мной · ВКЛ'
                  : 'Рядом со мной'}
              </span>
            </button>
          </div>
        </div>

        {/* Сетка АЗС */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5 pb-10" data-testid="station-list">
          {displayedStations.length > 0 ? (
            displayedStations.map((station) => (
              <StationCard
                key={station.osm_id || `${station.lat}_${station.lon}`}
                station={station}
              />
            ))
          ) : (
            <div className="col-span-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3 my-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Ничего не найдено</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                По текущим параметрам фильтрации заправок не найдено.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 cursor-pointer"
              >
                Показать все АЗС
              </button>
            </div>
          )}
        </div>
      </main>

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
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              aria-label="Закрыть уведомление"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Модальное окно «Что нового» (показывается 1 раз при обновлении версии) */}
      {isChangelogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseChangelog();
          }}
        >
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl text-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-900/95">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">Важное обновление</h2>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      v{CHANGELOG_VERSION}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Новый адрес сайта и поиск АЗС по GPS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseChangelog}
                aria-label="Закрыть"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs leading-relaxed">
              {/* Блок 1: Переезд на новый домен */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-1.5">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs sm:text-sm">
                  <span>🚀</span>
                  <span>Переезд на новый адрес (работает без ВПН!)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Из-за блокировок провайдерами старого хостинга наш радар переехал на новый постоянный адрес:
                </p>
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 select-all break-all">
                  https://platna.github.io/benzin-radar/
                </div>
                <p className="text-slate-400 text-[11px] leading-snug">
                  Новая ссылка открывается мгновенно на любом интернете без ВПН. Сохраните её в закладки или добавьте на главный экран телефона!
                </p>
              </div>

              {/* Блок 2: Поиск по местоположению */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-blue-500/30 space-y-1.5">
                <div className="font-bold text-blue-400 flex items-center gap-1.5 text-xs sm:text-sm">
                  <span>📍</span>
                  <span>Поиск заправок по вашему местоположению</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Нажмите кнопку <b>«Рядом со мной»</b> над списком станций — приложение запомнит выбор и будет автоматически:
                </p>
                <ul className="space-y-1 text-slate-300 text-[11px] pl-1">
                  <li>• Само выбирать ваш район (Нагорная часть или Ленинский).</li>
                  <li>• Показывать точное расстояние в километрах до каждой АЗС.</li>
                  <li>• Поднимать на самый верх ближайшие к вам заправки, где прямо сейчас есть <b>АИ-95 без очередей</b>!</li>
                </ul>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/95">
              <button
                type="button"
                onClick={handleCloseChangelog}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                Отлично, понятно! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-[11px] text-slate-400 space-y-1.5">
        <p className="max-w-md mx-auto">
          Бензин Радар НН · Оперативный мониторинг наличия АИ-95, очередей и лимитов на АЗС Нижнего Новгорода
        </p>
        <div>
          <button
            type="button"
            onClick={() => setIsChangelogOpen(true)}
            className="text-emerald-400/90 hover:text-emerald-300 underline underline-offset-2 cursor-pointer text-[11px]"
          >
            Что нового в v{CHANGELOG_VERSION}
          </button>
        </div>
      </footer>
    </div>
  );
}