import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Station, DistrictTab, FuelStatusFilter } from './types/station';
import {
  isNagornayaWhitelist,
  isLeninskyDistrict,
  check95Fuel,
  isQueueStation,
  formatQueueTrafficLight,
  GDEBENZ_URL
} from './utils/fuelLogic';
import { FALLBACK_STATIONS } from './data/mockStations';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { DeficitSummary } from './components/DeficitSummary';
import { StationCard } from './components/StationCard';
import { InfoModal } from './components/InfoModal';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [stations, setStations] = useState<Station[]>(FALLBACK_STATIONS);
  const [currentDistrict, setCurrentDistrict] = useState<DistrictTab>('nagornaya');
  const [activeFilter, setActiveFilter] = useState<FuelStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('только что');
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Fetch function with multiple CORS proxies, Netlify proxy, and local caching
  const loadStations = useCallback(async (showIndicator = true) => {
    if (showIndicator) setIsRefreshing(true);
    let fetched = false;

    // Helper to format current MSK time
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

    // Sequential candidate endpoints to bypass CORS on Netlify and other static hosts:
    // 1. /api/stations (handled by server.ts in Node dev, and by _redirects / netlify.toml on Netlify)
    // 2. https://corsproxy.io/?url=... (explicitly specified by user)
    // 3. Alternate public CORS proxy
    // 4. Direct fetch to gdebenz.ru
    const candidateEndpoints = [
      '/api/stations',
      `https://corsproxy.io/?url=${encodeURIComponent(GDEBENZ_URL)}`,
      `https://corsproxy.io/?url=https://gdebenz.ru/api/nearby?lat=56.3269&lon=44.0059&radius_km=25&limit=200`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(GDEBENZ_URL)}`,
      GDEBENZ_URL
    ];

    for (const endpoint of candidateEndpoints) {
      if (fetched) break;
      try {
        const res = await fetch(endpoint, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : json.stations;
          if (Array.isArray(list) && list.length > 0) {
            setStations(list);
            setIsLiveApi(true);
            fetched = true;
            try {
              localStorage.setItem('cached_live_stations', JSON.stringify(list));
              localStorage.setItem('cached_live_time', `МСК ${getNowMsk()}`);
            } catch {
              // Ignore localStorage quota errors
            }
            break;
          }
        }
      } catch {
        // Try next candidate endpoint
      }
    }

    // If all live network fetches failed, recover from recent localStorage cache
    if (!fetched) {
      try {
        const cached = localStorage.getItem('cached_live_stations');
        const cachedTime = localStorage.getItem('cached_live_time');
        if (cached) {
          const list = JSON.parse(cached);
          if (Array.isArray(list) && list.length > 0) {
            setStations(list);
            setIsLiveApi(true);
            if (cachedTime) setLastUpdatedTime(cachedTime);
            fetched = true;
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Only if network and localStorage both failed on fresh device, use fallback
    if (!fetched) {
      setStations(FALLBACK_STATIONS);
      setIsLiveApi(false);
    }

    setLastUpdatedTime(`МСК ${getNowMsk()}`);
    if (showIndicator) {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Attempt instant render from previous localStorage session
    try {
      const cached = localStorage.getItem('cached_live_stations');
      const cachedTime = localStorage.getItem('cached_live_time');
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list) && list.length > 0) {
          setStations(list);
          setIsLiveApi(true);
          if (cachedTime) setLastUpdatedTime(cachedTime);
        }
      }
    } catch {
      // Ignore
    }

    loadStations(false);

    // Auto-refresh every 5 minutes (matching script cron)
    const interval = setInterval(() => {
      loadStations(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadStations]);

  // Split stations into Nagornaya and Leninsky according to exact whitelist logic
  // Merge with fallback stations to guarantee all 17 and 11 stations are always present
  const nagornayaAll = useMemo(() => {
    const list = stations.filter(isNagornayaWhitelist);
    const existing = new Set(list.map((s) => s.addr || s.address || ''));
    const missing = FALLBACK_STATIONS.filter(isNagornayaWhitelist).filter(
      (fb) => !existing.has(fb.addr || fb.address || '')
    );
    return [...list, ...missing];
  }, [stations]);

  const leninskyAll = useMemo(() => {
    const list = stations.filter(isLeninskyDistrict);
    const existing = new Set(list.map((s) => s.addr || s.address || ''));
    const missing = FALLBACK_STATIONS.filter(isLeninskyDistrict).filter(
      (fb) => !existing.has(fb.addr || fb.address || '')
    );
    return [...list, ...missing];
  }, [stations]);

  // Calculate deficit statistics for Nagornaya
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

    const total = 17; // Fixed 17 as in script
    return { total, available, free, queue, empty: Math.max(0, total - available) };
  }, [nagornayaAll]);

  // Calculate deficit statistics for Leninsky
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

    const total = 11; // Fixed 11 as in script
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
        onRefresh={() => loadStations(true)}
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
