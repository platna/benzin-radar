import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const GOOGLE_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec';
const GDEBENZ_URL = GOOGLE_SCRIPT_API_URL;

let cachedStations: any = null;
let lastCacheTime = 0;

// Read bundled authentic feed as safety fallback
let defaultFeed: any = null;
try {
  const feedPath = path.resolve(__dirname, 'src/data/realStationsFeed.json');
  if (fs.existsSync(feedPath)) {
    defaultFeed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
  }
} catch (e) {
  console.warn('Could not load fallback feed:', e);
}

// Live proxy route that bypasses CORS and handles redirects cleanly
// Whitelist checkers for backend enrichment
function isTargetStation(s: any): boolean {
  if (!s) return false;
  const brand = (s.brand || s.name || '').toLowerCase();
  const addr = (s.addr || s.address || '').toLowerCase();
  const isTargetBrand = brand.includes('лукойл') || brand.includes('lukoil') ||
                        brand.includes('тебойл') || brand.includes('teboil') ||
                        brand.includes('газпром') || brand.includes('gazprom');
  if (!isTargetBrand) return false;

  // Nagornaya & Leninsky key streets
  const streets = [
    'слобод', 'родионов', 'казанск', 'суслов', 'ванеев', 'гагарин', 'магистральн',
    'тимирязев', 'юбилейн', 'сахаров', 'школьн', 'ларин',
    'ленина', 'комсомольск', 'новикова-прибоя', 'новикова прибоя',
    'героя попова', 'голубева', 'баумана', 'комарова', 'дружбы',
    'снежная', 'премудрова', 'переходникова', 'деревообделочн', 'молитовск'
  ];
  return streets.some(st => addr.includes(st));
}

// Enrich target stations directly from gdebenz.ru API
async function enrichTargetStations(stations: any[]): Promise<any[]> {
  // Ensure all target stations from defaultFeed are present
  if (defaultFeed && Array.isArray(defaultFeed.stations)) {
    const existingIds = new Set(stations.map((s: any) => String(s.osm_id || s.id)));
    for (const fb of defaultFeed.stations) {
      const id = String(fb.osm_id || fb.id);
      if (!existingIds.has(id) && isTargetStation(fb)) {
        stations.push({ ...fb });
        existingIds.add(id);
      }
    }
  }

  const targetStations = stations.filter(isTargetStation);
  
  await Promise.allSettled(
    targetStations.slice(0, 35).map(async (st: any) => {
      const id = st.osm_id || st.id;
      if (!id) return;
      try {
        const [cRes, rRes] = await Promise.all([
          fetch(`https://gdebenz.ru/api/comments/${encodeURIComponent(id)}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(3500)
          }).catch(() => null),
          fetch(`https://gdebenz.ru/api/comments/${encodeURIComponent(id)}/recent?limit=3`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(3500)
          }).catch(() => null)
        ]);

        if (cRes && cRes.ok) {
          const comment = await cRes.json();
          if (comment.confidenceBase !== undefined && comment.confidenceBase !== null) {
            st.confidence_base = comment.confidenceBase;
          }
          if (comment.confirmations !== undefined) {
            st.confirmations = comment.confirmations;
          }
          if (comment.confirmationsFresh !== undefined) {
            st.confirmations_fresh = comment.confirmationsFresh;
          }
          if (comment.fuelsNow !== undefined) {
            st.fuels_now = comment.fuelsNow;
          }
          if (comment.status === 'queue' || comment.status === 'low') {
            st.status = comment.status;
          }
          if (comment.svc) {
            st.svc = comment.svc;
          }
          if (comment.dtOnly !== undefined) {
            st.dt_only = comment.dtOnly;
          }
          if (comment.detail) {
            st.detail = comment.detail;
          }

          const isTerminalOnly = comment.svc === 'only' || st.svc === 'only';
          if (isTerminalOnly) {
            st.svc_only = true;
            st.svc = 'only';
            st.last_auto_at = comment.updated || st.last_at;
          } else {
            st.last_auto_at = null;
            if (comment.updated) {
              st.last_driver_at = comment.updated;
              st.last_at = comment.updated;
            }
          }
        }

        // Apply the exact latest driver mark from /recent (always takes precedence)
        if (rRes && rRes.ok) {
          const recent = await rRes.json();
          if (Array.isArray(recent) && recent.length > 0) {
            const lastMark = recent[0];
            if (lastMark) {
              if (lastMark.detail && lastMark.detail.trim().length > 0) {
                st.detail = lastMark.detail.trim();
              }
              if (lastMark.status) {
                st.status = lastMark.status;
              }
              if (lastMark.created_at) {
                st.last_driver_at = lastMark.created_at;
                st.last_at = lastMark.created_at;
                st.last_auto_at = null;
              }
            }
          }
        }
      } catch {
        // Ignore single station failure
      }
    })
  );

  return stations;
}

// Function to fetch live station feed with resilient fallbacks
async function getLiveOrEnrichedStations(): Promise<any[]> {
  const now = Date.now();
  let baseStations: any[] = [];

  try {
    const sep = GDEBENZ_URL.includes('?') ? '&' : '?';
    const apiRes = await fetch(`${GDEBENZ_URL}${sep}_t=${now}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000)
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      const list = Array.isArray(data) ? data : data.stations || [];
      if (list.length > 0) {
        baseStations = list;
      }
    }
  } catch (err: any) {
    // If Google Script is cold or times out, proceed to enrich defaultFeed directly
    console.info('Google Script feed note (using fast direct Gdebenz enrichment):', err.message || err);
  }

  // If Google Script did not return data, use defaultFeed as base
  if (baseStations.length === 0 && defaultFeed) {
    const raw = Array.isArray(defaultFeed) ? defaultFeed : defaultFeed.stations || [];
    baseStations = raw.map((s: any) => ({ ...s }));
  }

  if (baseStations.length > 0) {
    const enriched = await enrichTargetStations(baseStations);
    cachedStations = enriched;
    lastCacheTime = now;
    return enriched;
  }

  if (cachedStations) {
    return cachedStations;
  }

  throw new Error('Unable to obtain station data');
}

// Live proxy route with cache busting and station comments enrichment
app.get('/api/stations', async (req, res) => {
  const now = Date.now();
  const isForce = req.query.force === 'true' || req.query.force === '1';

  // Return warm cache if fresh (< 30s) and not an explicit user force refresh
  if (!isForce && cachedStations && now - lastCacheTime < 30 * 1000) {
    return res.json({
      stations: cachedStations,
      source: 'cache',
      timestamp: new Date(lastCacheTime).toISOString()
    });
  }

  try {
    const stations = await getLiveOrEnrichedStations();
    return res.json({
      stations,
      source: 'live',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    if (cachedStations) {
      return res.json({
        stations: cachedStations,
        source: 'stale-cache',
        timestamp: new Date(lastCacheTime).toISOString()
      });
    }
    if (defaultFeed) {
      const rawStations = Array.isArray(defaultFeed) ? defaultFeed : defaultFeed.stations || [];
      return res.json({
        stations: rawStations,
        source: 'authentic-feed',
        timestamp: new Date().toISOString()
      });
    }
    return res.status(502).json({ error: 'Unable to load fuel data' });
  }
});

// Proxy routes for individual station comments and recent driver marks
app.get('/api/comments/:id/recent', async (req, res) => {
  const id = req.params.id;
  try {
    const apiRes = await fetch(`https://gdebenz.ru/api/comments/${encodeURIComponent(id)}/recent?limit=5`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(4000)
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      return res.json(data);
    }
    return res.status(apiRes.status).json({ error: 'Gdebenz returned ' + apiRes.status });
  } catch (err: any) {
    return res.status(502).json({ error: err.message });
  }
});

app.get('/api/comments/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const apiRes = await fetch(`https://gdebenz.ru/api/comments/${encodeURIComponent(id)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(4000)
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      return res.json(data);
    }
    return res.status(apiRes.status).json({ error: 'Gdebenz returned ' + apiRes.status });
  } catch (err: any) {
    return res.status(502).json({ error: err.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Radar NN Server running on http://0.0.0.0:${PORT} (isProd: ${isProd})`);
    // Pre-warm station cache in background so first user request gets instant response
    getLiveOrEnrichedStations().catch(err => {
      console.warn('Initial cache warm-up notice:', err.message || err);
    });
  });
}

startServer();
