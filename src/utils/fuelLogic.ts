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
  status?: string; // "available" | "queue" | "warning" | "no" | "empty" | "none"
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

export const GDEBENZ_URL = "https://gdebenz.ru/api/nearby?lat=56.3269&lon=44.0059&radius_km=25&limit=200";

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
  const status = (s.status || "").toLowerCase();
  if (status === "no" || status === "empty" || status === "none" || status === "closed") {
    return { state: "none", has95: false, has95Plus: false };
  }

  // Stations with ONLY an automatic transaction signal ("Заправка работала") and no driver confirmation
  // GdeBenz: "Отметок водителей здесь нет. Недавно проходила оплата — значит, заправка работала. Есть ли сейчас топливо, никто не подтверждал."
  const isSvcOnly = s.svc === "only" || Boolean(s.svc_only) || (Boolean(s.svc_fresh) && !s.last_driver_at && (s.confidence_base ?? 1) <= 0.35);
  if (isSvcOnly) {
    return { state: "none", has95: false, has95Plus: false };
  }

  const fuelsNow = (s.fuels_now || "").toLowerCase();
  const detail = (s.detail || "").toLowerCase();

  const has95Plus = /(?:^|[^\d])95\+/i.test(detail) || /g[-_ ]?95|g-drive|экто/i.test(detail) || /(?:^|[,\s])95\+/i.test(fuelsNow);
  const has95Explicit = /(?:^|[^\d])95(?:\+|plus)?(?:[^\d]|$)/i.test(detail) || /(?:^|[,\s])95(?:\+|plus)?(?:[,\s]|$)/i.test(fuelsNow);

  // If detail explicitly says NO 95 (e.g. "нет 95", "95 нет", "без 95", "только 92", "только дт")
  if (/нет 95|95 нет|без 95|только (?:дт|дизель|92)|заправка не работает/i.test(detail)) {
    return { state: "none", has95: false, has95Plus: false };
  }

  // If explicit fuel list mentions other fuels (like '92, ДТ' or 'ДТ') and NOT 95
  const explicitFuels = fuelsNow || detail;
  const mentionsOtherFuels = /(?:^|[^\dа-яa-z])(92|98|100|дт|дизель|газ)(?:[^\dа-яa-z]|$)/i.test(explicitFuels);
  if (mentionsOtherFuels && !has95Explicit && !has95Plus) {
    return { state: "none", has95: false, has95Plus: false };
  }

  // Active status stations have AI-95 available
  const has95 = has95Explicit || status === "yes";

  let state: "available" | "queue" = "available";
  if (status === "queue" || status === "warning" || /очеред/i.test(detail) || /очеред/i.test(fuelsNow) || Boolean(s.meta?.queue)) {
    state = "queue";
  }
  return { state, has95, has95Plus };
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
