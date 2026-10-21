export interface Station {
  id?: string | number;
  osm_id?: string | number;
  name?: string;
  brand?: string;
  addr?: string;
  address?: string;
  lat: number;
  lon: number;
  latitude?: number;
  longitude?: number;
  lng?: number;
  status?: string | null; // "available" | "queue" | "warning" | "no" | "empty" | "none" | null
  fuels_now?: string;
  detail?: string;
  confidence_base?: number; // e.g. 0.90 for 90%
  last_at?: string; // UTC ISO string e.g. "2026-10-15 10:24:00"
  last_driver_at?: string | null;
  last_auto_at?: string | null;
  svc?: string | null;
  svc_fresh?: boolean;
  distance_km?: number;
  confirmations?: number;
  meta?: any;
  svc_only?: boolean;
  [key: string]: any;
}

export const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec";
export const GDEBENZ_URL = GOOGLE_SCRIPT_API_URL;

export function isBorOrOutskirts(s: Partial<Station>): boolean {
  const addr = (s.addr || s.address || "").toLowerCase();
  const name = (s.name || s.brand || "").toLowerCase();
  const stopWords = [
    "бор,", "бор ", "г. бор", "г.бор", "борский",
    "озерная", "неклюдово", "толоконцево", "стеклозавод",
    "дзержинск", "красногорка"
  ];
  for (let k = 0; k < stopWords.length; k++) {
    if (addr.indexOf(stopWords[k]) !== -1 || name.indexOf(stopWords[k]) !== -1) return true;
  }
  const lat = s.lat ?? s.latitude;
  const lon = s.lon ?? s.lng ?? s.longitude;
  if (lat && lon && lat > 56.345 && lon > 44.03) return true;
  return false;
}

// 1. НАГОРНАЯ ЧАСТЬ (17 АЗС)
export function isNagornayaWhitelist(s: Partial<Station>): boolean {
  if (isBorOrOutskirts(s)) return false;
  const brand = (s.brand || s.name || "").toLowerCase();
  const addr = (s.addr || s.address || "").toLowerCase();

  const isLukoil = brand.indexOf("лукойл") !== -1 || brand.indexOf("lukoil") !== -1;
  const isTeboil = brand.indexOf("teboil") !== -1 || brand.indexOf("тебойл") !== -1;
  if (isLukoil || isTeboil) {
    if (addr.indexOf("слобод") !== -1 && /(?:^|[^\d])10(?:[^\d]|$)/.test(addr)) return true;
    if (addr.indexOf("родионов") !== -1 && addr.indexOf("163") !== -1) return true;
    if (addr.indexOf("казанск") !== -1 && /(?:^|[^\d])6(?:[^\dа-яa-z]|а|a|$)/.test(addr) && addr.indexOf("16") === -1 && addr.indexOf("60") === -1) return true;
    if (addr.indexOf("суслов") !== -1 && /(?:^|[^\d])21(?:[^\d]|$)/.test(addr)) return true;
    if (addr.indexOf("ванеев") !== -1 && addr.indexOf("110") !== -1) return true;
    if (addr.indexOf("ванеев") !== -1 && addr.indexOf("247") !== -1) return true;
    if (addr.indexOf("гагарин") !== -1 && /(?:^|[^\d])23(?:[^\dа-яa-z]|в|v|$)/.test(addr)) return true;
    if (addr.indexOf("гагарин") !== -1 && /(?:^|[^\d])31(?:[^\dа-яa-z]|а|a|$)/.test(addr)) return true;
    if (addr.indexOf("магистральн") !== -1 && /(?:^|[^\d])6(?:[^\d]|$)/.test(addr) && addr.indexOf("16") === -1 && addr.indexOf("10") === -1) return true;
  }

  const isGPN = brand.indexOf("газпромнефть") !== -1 || brand.indexOf("gazpromneft") !== -1 || brand.indexOf("газпром") !== -1;
  if (isGPN) {
    if (addr.indexOf("тимирязев") !== -1 && addr.indexOf("11") !== -1) return true;
    if (addr.indexOf("юбилейн") !== -1 && /(?:^|[^\d])3(?:[^\d]|$)/.test(addr)) return true;
    if (addr.indexOf("сахаров") !== -1 && /(?:^|[^\d])8(?:[^\d]|$)/.test(addr)) return true;
    if (addr.indexOf("магистральн") !== -1 && addr.indexOf("10") !== -1) return true;
    if (addr.indexOf("школьн") !== -1 && (addr.indexOf("70а") !== -1 || addr.indexOf("70 а") !== -1 || addr.indexOf("70-а") !== -1)) return true;
    if (addr.indexOf("школьн") !== -1 && (addr.indexOf("70б") !== -1 || addr.indexOf("70 б") !== -1 || addr.indexOf("70-б") !== -1)) return true;
    if (addr.indexOf("ларин") !== -1 && addr.indexOf("32") !== -1) return true;
    if (addr.indexOf("ларин") !== -1 && /(?:^|[^\d])2(?:[^\dа-яa-z]|$)/.test(addr) && addr.indexOf("32") === -1) return true;
  }
  return false;
}

// 2. ЛЕНИНСКИЙ РАЙОН
export function isLeninskyDistrict(s: Partial<Station>): boolean {
  if (isBorOrOutskirts(s)) return false;
  const brand = (s.brand || s.name || "").toLowerCase();
  const isTargetBrand = (brand.indexOf("лукойл") !== -1 || brand.indexOf("lukoil") !== -1 ||
                         brand.indexOf("teboil") !== -1 || brand.indexOf("тебойл") !== -1 ||
                         brand.indexOf("газпромнефть") !== -1 || brand.indexOf("gazpromneft") !== -1 || brand.indexOf("газпром") !== -1);
  if (!isTargetBrand) return false;

  const addr = (s.addr || s.address || "").toLowerCase();
  const leninskyKeywords = [
    "ленина", "комсомольск", "новикова-прибоя", "новикова прибоя",
    "героя попова", "голубева", "баумана", "комарова", "дружбы",
    "снежная", "премудрова", "переходникова", "деревообделочн", "молитовск"
  ];
  for (let i = 0; i < leninskyKeywords.length; i++) {
    if (addr.indexOf(leninskyKeywords[i]) !== -1) return true;
  }
  return false;
}

export interface FuelCheckResult {
  state: "available" | "queue" | "none";
  has95: boolean;
  has95Plus: boolean;
}

export function check95Fuel(s: Partial<Station>): FuelCheckResult {
  const status = (s.status || (s.detail || s.fuels_now ? "yes" : "")).toLowerCase();
  if (!status || status === "no" || status === "empty" || status === "none" || status === "closed") {
    return { state: "none", has95: false, has95Plus: false };
  }

  // Stations with ONLY an automatic transaction signal ("Заправка работала") and no driver confirmation
  // GdeBenz: "Отметок водителей здесь нет. Недавно проходила оплата — значит, заправка работала. Есть ли сейчас топливо, никто не подтверждал."
  const hasDriverFuelDetail = Boolean(s.detail && cleanDetailFuels(s.detail));
  const hasDriverFuelsNow = Boolean(s.fuels_now && s.fuels_now.trim().length > 0);
  const isSvcOnly = (s.svc === "only" || Boolean(s.svc_only)) && !hasDriverFuelDetail && !hasDriverFuelsNow;
  if (isSvcOnly) {
    return { state: "none", has95: false, has95Plus: false };
  }

  if (Boolean(s.dt_only)) {
    return { state: "none", has95: false, has95Plus: false };
  }

  const detail = (s.detail || "").toLowerCase();
  const fuelsNow = (s.fuels_now || "").toLowerCase();

  // If detail explicitly says NO 95 (e.g. "нет 95", "95 нет", "без 95", "нет топлива", "перерыв", "слив", "только 92", "только дт")
  if (/нет 95|95 нет|без 95|нет топлива|перерыв|слив|только (?:дт|дизель|92)|видимо только (?:дт|дизель)|заправка не работает/i.test(detail)) {
    return { state: "none", has95: false, has95Plus: false };
  }

  const cleanTokens = detail
    .replace(/(?:очередь[:\s\-]*[^.;\n·]+|без очереди)/gi, ' ')
    .replace(/лимит[:\s\-]*[^.;\n·]+/gi, ' ');
  const has95PlusInDetail = /(?:^|[^\d])(?:аи[- ]?)?95\+/i.test(cleanTokens) || /g[-_ ]?95|g-drive|экто/i.test(cleanTokens);
  const has95InDetail = /(?:^|[^\d])(?:аи[- ]?)?95(?:\+|plus)?(?:[^\d]|$)/i.test(cleanTokens) || has95PlusInDetail;
  const detailMentionsFuel = /(?:^|[^\dа-яa-z]|аи[- ]?)(92|95|98|100|дт|дизель|газ)(?:[^\dа-яa-z]|$)/i.test(cleanTokens);

  // If recent user detail specifies fuels and does NOT mention 95 (e.g. detail is 'ДТ', 'дизель', '92, ДТ')
  if (detailMentionsFuel && !has95InDetail) {
    return { state: "none", has95: false, has95Plus: false };
  }

  const has95PlusInFuelsNow = /(?:^|[,\s])95\+/i.test(fuelsNow) || /g95|g-95|экто95/i.test(fuelsNow);
  const has95InFuelsNow = /(?:^|[,\s])95(?:\+|plus)?(?:[,\s]|$)/i.test(fuelsNow) || has95PlusInFuelsNow;
  const fuelsNowMentionsFuel = /(?:^|[^\dа-яa-z])(92|95|98|100|дт|дизель|газ)(?:[^\dа-яa-z]|$)/i.test(fuelsNow);

  // If fuels_now specifies fuels without 95 (e.g. '92,ДТ' or 'ДТ')
  if (fuelsNowMentionsFuel && !has95InFuelsNow) {
    return { state: "none", has95: false, has95Plus: false };
  }

  // If station has meta pump specs, verify that 95 is physically sold here
  if (s.meta && Array.isArray(s.meta.f) && s.meta.f.length > 0) {
    const fList = (s.meta.f as string[]).map((x: string) => x.toLowerCase().trim());
    if (!fList.includes('95') && !fList.includes('ai-95')) {
      return { state: "none", has95: false, has95Plus: false };
    }
  }

  // At this stage, station is confirmed active (status: 'yes' or 'queue').
  // Monitored network stations (Лукойл, Газпромнефть, Teboil) have 95 unless explicitly excluded above.
  // 95+ (G-Drive / Экто) is true ONLY if explicitly marked in detail or fuelsNow by drivers
  let has95Plus = false;
  if (detailMentionsFuel) {
    has95Plus = has95PlusInDetail;
  } else if (fuelsNowMentionsFuel) {
    has95Plus = has95PlusInFuelsNow;
  }

  let state: "available" | "queue" = "available";
  const queueTraffic = formatQueueTrafficLight(s.detail);
  if (status === "queue" || status === "warning" || Boolean(s.meta?.queue)) {
    state = "queue";
  } else if (queueTraffic) {
    // Only yellow/red traffic lights represent a queue
    if (queueTraffic.level === "yellow" || queueTraffic.level === "red") {
      state = "queue";
    }
  } else if (/(?:большая|длинная|огромная)\s+очеред/i.test(detail)) {
    state = "queue";
  }
  return { state, has95: true, has95Plus };
}

export function isQueueStation(s: Partial<Station>): boolean {
  const fuel = check95Fuel(s);
  if (fuel.state === "none") return false;
  if (fuel.state === "queue") return true;
  const queueTraffic = formatQueueTrafficLight(s.detail);
  return Boolean(queueTraffic && (queueTraffic.level === "yellow" || queueTraffic.level === "red"));
}

export interface QueueTrafficLight {
  level: "green" | "yellow" | "red" | "unknown";
  text: string;
  icon: string;
}

export function formatQueueTrafficLight(detail?: string): QueueTrafficLight | null {
  if (!detail) return null;
  const qMatch = detail.match(/(?:Очередь|очередь)\s*[:\s]*([^·,\n]+)?/i);

  if (!qMatch || !qMatch[1] || qMatch[1].trim().length === 0 || /^[·,\-\s:]*$/.test(qMatch[1].trim())) {
    if (/очередь/i.test(detail)) {
      return { level: "yellow", text: "Очередь", icon: "🟡" };
    }
    return null;
  }

  const qText = qMatch[1].trim();
  const qLower = qText.toLowerCase();

  if (qLower.indexOf("больше 2") !== -1 || qLower.indexOf("1–2") !== -1 || qLower.indexOf("1-2") !== -1 || qLower.indexOf("2 ч") !== -1) {
    return { level: "red", text: `Очередь: ${qText}`, icon: "🔴" };
  } else if (qLower.indexOf("30–60") !== -1 || qLower.indexOf("30-60") !== -1 || qLower.indexOf("15–30") !== -1 || qLower.indexOf("15-30") !== -1) {
    return { level: "yellow", text: `Очередь: ${qText}`, icon: "🟡" };
  } else if (qLower.indexOf("до 15") !== -1 || qLower.indexOf("нет") !== -1) {
    return { level: "green", text: `Очередь: ${qText}`, icon: "🟢" };
  }
  return { level: "yellow", text: `Очередь: ${qText}`, icon: "⏳" };
}

export function getFreshnessText(utcDateStr?: string): { timeMsk: string; diffText: string; full: string } {
  if (!utcDateStr) return { timeMsk: "--:--", diffText: "недавно", full: "недавно" };
  try {
    const cleanStr = utcDateStr.replace(" ", "T");
    const date = new Date(cleanStr.endsWith("Z") ? cleanStr : cleanStr + "Z");
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    // Format in Moscow time (UTC+3)
    const mskFormatter = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit"
    });
    const timeMsk = mskFormatter.format(date);

    let diffText = "только что";
    if (diffMinutes >= 1 && diffMinutes < 5) diffText = "3-5 мин. назад";
    else if (diffMinutes >= 5 && diffMinutes < 60) diffText = `${diffMinutes} мин. назад`;
    else if (diffMinutes >= 60 && diffMinutes < 1440) diffText = `${Math.floor(diffMinutes / 60)} ч. назад`;
    else if (diffMinutes >= 1440) diffText = `${Math.floor(diffMinutes / 1440)} дн. назад`;
    else if (diffMinutes < 0) diffText = "только что";

    return {
      timeMsk,
      diffText,
      full: `${timeMsk} (${diffText})`
    };
  } catch {
    return { timeMsk: "--:--", diffText: "свежие данные", full: "свежие данные" };
  }
}

export function calculateWhereBenzConfidence(base?: number, dateStr?: string): number | null {
  if (base === undefined || base === null || base <= 0) return null;
  try {
    const cleanStr = typeof dateStr === 'string'
      ? dateStr.replace(' ', 'T') + (/[zZ]|[+\-]\d\d:?\d\d$/.test(dateStr) ? '' : 'Z')
      : dateStr;
    const timeMs = cleanStr ? new Date(cleanStr).getTime() : NaN;
    const hoursAgo = isNaN(timeMs) ? 0 : Math.max(0, (Date.now() - timeMs) / 3600000);

    let decay: number;
    if (hoursAgo <= 8) {
      decay = 1 - (hoursAgo / 8) * 0.2;
    } else if (hoursAgo <= 24) {
      decay = 0.8 - (0.45 * (hoursAgo - 8)) / 16;
    } else {
      decay = Math.max(0.15, 0.35 - 0.004 * (hoursAgo - 24));
    }

    let pct = 5 * Math.round((100 * base * decay) / 5);
    pct = Math.max(5, Math.min(90, pct));
    return pct;
  } catch {
    // If date parsing fails, round base to nearest 5% step (e.g. 0.8795 -> 90 or 85, never raw 88)
    let pct = 5 * Math.round((100 * base) / 5);
    return Math.max(5, Math.min(90, pct));
  }
}

export function parsePrice(price?: number | string, detail?: string): string | null {
  if (price !== undefined && price !== null && price !== "") {
    return `${price}`;
  }
  if (detail) {
    const pMatch = detail.match(/(\d+[.,]\d{2})\s*(?:₽|руб)/i);
    if (pMatch) return pMatch[1].replace(",", ".");
  }
  return null;
}

export function parseLimit(detail?: string): string | null {
  if (!detail) return null;
  const limMatch = detail.match(/(?:Лимит|лимит)\s*[:\s-]*([^·,\n]+)/i);
  return limMatch ? limMatch[1].trim() : null;
}

export function parseBreak(detail?: string): string | null {
  if (!detail) return null;
  const breakMatch = detail.match(/(?:перерыв(?:\s+до\s+\d+\s*ч)?|слив(?:\s+бензовоза)?)[^·,\n]*/i);
  if (breakMatch) return breakMatch[0].trim();
  if (/слив/i.test(detail)) return "Слив бензовоза (перерыв до 1 ч)";
  if (/перерыв/i.test(detail)) return "Технический перерыв";
  return null;
}

export function cleanDetailFuels(detail?: string): string | null {
  if (!detail) return null;
  return detail
    .replace(/(\d+[.,]\d{2}\s*(?:₽|руб\.?|рублей))/gi, '')
    .replace(/(?:[·,;\-]\s*)?(?:очередь[:\s\-]*[^·;\n]+|без очереди)/gi, '')
    .replace(/(?:[·,;\-]\s*)?лимит[:\s\-]*[^·;\n]+/gi, '')
    .replace(/(?:[·,;\-]\s*)?перерыв(?:\s+до\s+\d+\s*ч)?[:\s\-]*[^·;\n]*/gi, '')
    .replace(/(?:[·,;\-]\s*)?слив(?:\s+бензовоза)?[:\s\-]*[^·;\n]*/gi, '')
    .replace(/(?:[·,;\-]\s*)?нет\s+топлива/gi, '')
    .replace(/·\s*·/g, '·')
    .replace(/^[\s·,;\-]+|[\s·,;\-]+$/g, '')
    .trim() || null;
}

export interface StationFuelsInfo {
  text: string;
  source: 'live' | 'meta' | 'last_known';
  label?: string;
}

export function getStationFuelsInfo(station: Partial<Station>): StationFuelsInfo {
  // 1. From live detail (stripping queue and limits) - this is the genuine latest driver mark!
  const cleanedDetail = cleanDetailFuels(station.detail);
  if (cleanedDetail && cleanedDetail.length > 0) {
    return { text: cleanedDetail, source: 'live', label: 'по последней отметке' };
  }

  // 2. From live fuels_now (aggregate of recent marks)
  if (station.fuels_now && station.fuels_now.trim().length > 0) {
    const formatted = station.fuels_now
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
      .join(', ');
    if (formatted) {
      return { text: formatted, source: 'live', label: 'по последней отметке' };
    }
  }

  // 3. Fallback from station.meta.f (OpenStreetMap / official pumps on this station)
  if (station.meta && Array.isArray(station.meta.f) && station.meta.f.length > 0) {
    const fList = (station.meta.f as string[]).map((x: string) => x.toLowerCase().trim());
    const brand = (station.brand || station.name || '').toLowerCase();
    const isLukoil = brand.includes('лукойл') || brand.includes('lukoil');
    const isGpn = brand.includes('газпром') || brand.includes('gazprom');
    const isTeboil = brand.includes('teboil') || brand.includes('тебойл');

    const result: string[] = [];
    if (fList.includes('92')) result.push('92');
    if (fList.includes('95')) result.push('95');
    if (isGpn || isTeboil || (isLukoil && !fList.includes('100'))) {
      if (fList.includes('95')) result.push('95+');
    }
    if (fList.includes('98')) result.push('98');
    if (fList.includes('100')) result.push('100');
    if (fList.includes('dt') || fList.includes('дт')) result.push('ДТ');
    if (fList.includes('lpg') || fList.includes('газ')) result.push('Газ');

    if (result.length > 0) {
      return {
        text: result.join(', '),
        source: 'meta',
        label: 'по паспорту АЗС'
      };
    }
  }

  // 4. Known catalog fallback for monitored stations where detail/fuels_now/meta are absent
  const brand = (station.brand || station.name || '').toLowerCase();
  const addr = (station.addr || station.address || '').toLowerCase();

  if (addr.includes('попова, 38') || addr.includes('попова 38')) {
    return { text: '92, 95, 95+, ДТ, Газ', source: 'last_known', label: 'по паспорту АЗС' };
  }
  if (addr.includes('ванеева') && addr.includes('247')) {
    return { text: '92, 95, 100, ДТ', source: 'last_known', label: 'по паспорту АЗС' };
  }
  if (brand.includes('газпром') || brand.includes('gazprom')) {
    return { text: '92, 95, ДТ', source: 'last_known', label: 'по паспорту АЗС' };
  }
  if (brand.includes('лукойл') || brand.includes('lukoil')) {
    return { text: '92, 95, 100, ДТ', source: 'last_known', label: 'по паспорту АЗС' };
  }
  if (brand.includes('teboil') || brand.includes('тебойл')) {
    return { text: '92, 95, ДТ', source: 'last_known', label: 'по паспорту АЗС' };
  }

  return { text: '92, 95, ДТ', source: 'last_known', label: 'по паспорту АЗС' };
}

export interface BrandInfo {
  type: "lukoil" | "teboil" | "gpn" | "other";
  displayName: string;
  premiumFuelName: string;
  color: string;
  accentBg: string;
  badgeBorder: string;
}

export function getBrandInfo(rawBrand?: string, rawName?: string): BrandInfo {
  const brand = (rawBrand || rawName || "").toLowerCase();
  if (brand.indexOf("лукойл") !== -1 || brand.indexOf("lukoil") !== -1) {
    return {
      type: "lukoil",
      displayName: "Лукойл",
      premiumFuelName: "95 Экто",
      color: "#ef4444", // vibrant red
      accentBg: "bg-red-500/10 text-red-400 border-red-500/30",
      badgeBorder: "border-red-500/40"
    };
  }
  if (brand.indexOf("teboil") !== -1 || brand.indexOf("тебойл") !== -1) {
    return {
      type: "teboil",
      displayName: "Teboil",
      premiumFuelName: "95+",
      color: "#eab308", // gold / yellow
      accentBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      badgeBorder: "border-amber-500/40"
    };
  }
  if (brand.indexOf("газпромнефть") !== -1 || brand.indexOf("gazpromneft") !== -1 || brand.indexOf("газпром") !== -1) {
    return {
      type: "gpn",
      displayName: "Газпромнефть",
      premiumFuelName: "95 G-Drive",
      color: "#0284c7", // cyan / blue
      accentBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      badgeBorder: "border-sky-500/40"
    };
  }
  return {
    type: "other",
    displayName: rawBrand || rawName || "АЗС",
    premiumFuelName: "95+",
    color: "#94a3b8",
    accentBg: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    badgeBorder: "border-slate-500/40"
  };
}

export function getNavigationUrls(station: Partial<Station>) {
  const lat = station.lat ?? station.latitude;
  const lon = station.lon ?? station.lng ?? station.longitude;
  const stationKey = station.osm_id || station.id || "";

  const yandexUrl = (lat && lon)
    ? `https://yandex.ru/maps/?rtext=~${lat},${lon}&rtt=auto`
    : "https://yandex.ru/maps";

  const twoGisUrl = (lat && lon)
    ? `https://2gis.ru/n_novgorod/search/${lat}%2C${lon}`
    : "https://2gis.ru/n_novgorod";

  const gdebenzUrl = stationKey
    ? `https://gdebenz.ru/?station=${stationKey}`
    : (lat && lon ? `https://gdebenz.ru/?lat=${lat}&lon=${lon}` : "https://gdebenz.ru");

  return { yandexUrl, twoGisUrl, gdebenzUrl };
}
