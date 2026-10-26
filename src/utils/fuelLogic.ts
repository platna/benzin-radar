import { Station } from '../types/station';

export const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec";
export const GDEBENZ_URL = "https://corsproxy.io/?url=https://gdebenz.ru/api/nearby?lat=56.3269&lon=44.0059&radius_km=25&limit=200";

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

// 1. НАГОРНАЯ ЧАСТЬ (СТРОГО 17 АЗС)
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

// 2. ЛЕНИНСКИЙ РАЙОН (10 АЗС)
export function isLeninskyDistrict(s: Partial<Station>): boolean {
  if (isBorOrOutskirts(s)) return false;
  const brand = (s.brand || s.name || "").toLowerCase();
  const addr = (s.addr || s.address || "").toLowerCase();

  if (brand.indexOf("опти") !== -1 || addr.indexOf("5б") !== -1) return false;

  const isTargetBrand = (brand.indexOf("лукойл") !== -1 || brand.indexOf("lukoil") !== -1 ||
                         brand.indexOf("teboil") !== -1 || brand.indexOf("тебойл") !== -1 ||
                         brand.indexOf("газпромнефть") !== -1 || brand.indexOf("gazpromneft") !== -1 || brand.indexOf("газпром") !== -1);
  if (!isTargetBrand) return false;

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

export function isMarkExpired(s: Partial<Station>): boolean {
  const timeStr = s.last_driver_at || s.last_at;
  if (!timeStr) return false;
  try {
    const cleanTime = timeStr.replace(' ', 'T') + (/[zZ]|[+\-]\d\d:?\d\d$/.test(timeStr) ? '' : 'Z');
    const timeMs = new Date(cleanTime).getTime();
    if (isNaN(timeMs)) return false;
    return (Date.now() - timeMs) / 3600000 >= 24;
  } catch {
    return false;
  }
}

export function cleanDetailFuels(detail?: string): string | null {
  if (!detail) return null;
  const cleaned = detail
    .replace(/(\d+[.,]\d{2}\s*(?:₽|руб\.?|рублей))/gi, '')
    .replace(/(?:[·,;\-]\s*)?(?:очередь[:\s\-]*[^·;\n]+|без очереди)/gi, '')
    .replace(/(?:[·,;\-]\s*)?лимит[:\s\-]*[^·;\n]+/gi, '')
    .replace(/(?:[·,;\-]\s*)?перерыв(?:\s+до\s+\d+\s*ч)?[:\s\-]*[^·;\n]*/gi, '')
    .replace(/(?:[·,;\-]\s*)?слив(?:\s+бензовоза)?[:\s\-]*[^·;\n]*/gi, '')
    .replace(/(?:[·,;\-]\s*)?нет\s+топлива/gi, '')
    .replace(/·\s*·/g, '·')
    .replace(/^[\s·,;\-]+|[\s·,;\-]+$/g, '')
    .trim();

  if (/(?:^|[^\dа-яa-z]|аи[- ]?)(92|95|98|100|дт|дизель|газ)(?:[^\dа-яa-z]|$)/i.test(cleaned)) {
    return cleaned;
  }
  return null;
}

function parseTokens(str?: string): { has95: boolean; has95Plus: boolean; mentionsOtherOnly: boolean } {
  if (!str) return { has95: false, has95Plus: false, mentionsOtherOnly: false };

  const tokens = str.toLowerCase().split(/[,·;\/\n\s]+/).map(t => t.trim()).filter(Boolean);
  let has95 = false;
  let has95Plus = false;
  let hasOther = false;

  for (const t of tokens) {
    if (t === '95+' || t.includes('95+') || t.includes('экто') || t.includes('g-drive') || t.includes('g95')) {
      has95Plus = true;
    } else if (t === '95' || t === 'аи-95' || t === 'аи95') {
      has95 = true;
    } else if (t.includes('92') || t.includes('дт') || t.includes('100') || t.includes('дизель') || t.includes('газ')) {
      hasOther = true;
    }
  }

  return { has95, has95Plus, mentionsOtherOnly: hasOther && !has95 && !has95Plus };
}

// Строжайшая проверка 95-го по ПЕРВОЙ свежей отметке водителя
export function check95Fuel(s: Partial<Station>): FuelCheckResult {
  const status = (s.status || "").toLowerCase();
  const detail = (s.detail || "").toLowerCase();
  const fuelsNow = (s.fuels_now || "").toLowerCase();

  if (s.dt_only === 1 || s.dt_only === true || s.dt_only === "1") {
    return { state: "none", has95: false, has95Plus: false };
  }
  if (status === "no" || status === "empty" || status === "none" || status === "closed") {
    return { state: "none", has95: false, has95Plus: false };
  }
  if (/нет 95|95 нет|без 95|нет топлива|заправка не работает|перерыв|слив/i.test(detail)) {
    return { state: "none", has95: false, has95Plus: false };
  }

  // 1. АБСОЛЮТНЫЙ ПРИОРИТЕТ: свежая отметка водителя detail
  if (s.detail && s.detail.trim().length > 0) {
    const cleaned = cleanDetailFuels(s.detail);
    const parsed = parseTokens(cleaned || s.detail);

    // Если водитель отметил только 92 или ДТ (без 95) — СТРОГО КРАСНЫЙ!
    if (parsed.mentionsOtherOnly) {
      return { state: "none", has95: false, has95Plus: false };
    }

    if (parsed.has95 || parsed.has95Plus) {
      const state = (s.conflict === "queue" || status === "queue" || status === "warning" || Boolean(s.meta?.queue)) ? "queue" : "available";
      return { state, has95: parsed.has95, has95Plus: parsed.has95Plus };
    }
  }

  // 2. Вторично: fuels_now
  if (fuelsNow.length > 0) {
    const parsedF = parseTokens(fuelsNow);
    if (parsedF.mentionsOtherOnly) {
      return { state: "none", has95: false, has95Plus: false };
    }
    if (parsedF.has95 || parsedF.has95Plus) {
      const state = (s.conflict === "queue" || status === "queue" || status === "warning") ? "queue" : "available";
      return { state, has95: parsedF.has95, has95Plus: parsedF.has95Plus };
    }
  }

  return { state: "none", has95: false, has95Plus: false };
}

export function isQueueStation(s: Partial<Station>): boolean {
  const fuel = check95Fuel(s);
  if (fuel.state === "none") return false;
  if (fuel.state === "queue") return true;
  const queueTraffic = formatQueueTrafficLight(s.detail);
  return Boolean(queueTraffic && (queueTraffic.level === "yellow" || queueTraffic.level === "red"));
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

export function parsePrice(price?: number | string, detail?: string): string | null {
  if (price !== undefined && price !== null && price !== "") return `${price}`;
  if (detail) {
    const pMatch = detail.match(/(\d+[.,]\d{2})\s*(?:₽|руб)/i);
    if (pMatch) return pMatch[1].replace(",", ".");
  }
  return null;
}

export interface StationFuelsInfo {
  text: string;
  source: 'live' | 'meta' | 'last_known';
  label?: string;
}

export function getStationFuelsInfo(station: Partial<Station>): StationFuelsInfo {
  const status = (station.status || '').toLowerCase();
  const detail = (station.detail || '').toLowerCase();

  if (station.dt_only === 1 || station.dt_only === true) {
    return { text: 'только ДТ', source: 'live', label: 'только дизель' };
  }

  if (status === 'no' || status === 'empty' || status === 'none' || /нет топлива|заправка не работает/i.test(detail)) {
    return { text: 'нет топлива', source: 'live', label: 'по последней отметке' };
  }

  const cleanedDetail = cleanDetailFuels(station.detail);
  if (cleanedDetail && cleanedDetail.length > 0) {
    const formatted = cleanedDetail.split(/[,·;\s]+/).filter(Boolean).map(f => f.toUpperCase()).join(', ');
    return { text: formatted || cleanedDetail, source: 'live', label: 'по последней отметке' };
  }

  if (station.fuels_now && station.fuels_now.trim().length > 0) {
    const formatted = station.fuels_now
      .split(',')
      .map((f) => f.trim().toUpperCase())
      .filter(Boolean)
      .join(', ');
    if (formatted) {
      return { text: formatted, source: 'live', label: 'актуально сегодня' };
    }
  }

  return { text: 'нет свежих отметок', source: 'last_known', label: 'нет информации' };
}

export function getFuelClass(s: Partial<Station>): string | null {
  const rawClass = s.fuel_class || s.class_name;
  if (!rawClass) return null;
  const str = String(rawClass).trim();
  if (/не\s*отмечал|не\s*указан|неизвестно|\?/i.test(str)) {
    return null;
  }
  return str.startsWith("Евро") ? str : `Евро-${str} (К${str})`;
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
  if (!utcDateStr) return { timeMsk: "--:--", diffText: "нет отметок", full: "нет свежих отметок" };
  try {
    const cleanStr = utcDateStr.replace(" ", "T");
    const date = new Date(cleanStr.endsWith("Z") ? cleanStr : cleanStr + "Z");
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes >= 1440 || diffMinutes < -120) {
      return { timeMsk: "--:--", diffText: "нет отметок", full: "нет свежих отметок" };
    }

    const mskFormatter = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit"
    });
    const timeMsk = mskFormatter.format(date);

    let diffText = "только что";
    if (diffMinutes >= 1 && diffMinutes < 5) diffText = "3-5 мин. назад";
    else if (diffMinutes >= 5 && diffMinutes < 60) diffText = `${diffMinutes} мин. назад`;
    else if (diffMinutes >= 60) diffText = `${Math.floor(diffMinutes / 60)} ч. назад`;
    else if (diffMinutes < 0) diffText = "только что";

    return { timeMsk, diffText, full: `${timeMsk} (${diffText})` };
  } catch {
    return { timeMsk: "--:--", diffText: "нет отметок", full: "нет отметок" };
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
    let pct = 5 * Math.round((100 * base) / 5);
    return Math.max(5, Math.min(90, pct));
  }
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
      color: "#ef4444",
      accentBg: "bg-red-500/10 text-red-400 border-red-500/30",
      badgeBorder: "border-red-500/40"
    };
  }
  if (brand.indexOf("teboil") !== -1 || brand.indexOf("тебойл") !== -1) {
    return {
      type: "teboil",
      displayName: "Teboil",
      premiumFuelName: "95+",
      color: "#eab308",
      accentBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      badgeBorder: "border-amber-500/40"
    };
  }
  if (brand.indexOf("газпромнефть") !== -1 || brand.indexOf("gazpromneft") !== -1 || brand.indexOf("газпром") !== -1) {
    return {
      type: "gpn",
      displayName: "Газпромнефть",
      premiumFuelName: "95 G-Drive",
      color: "#0284c7",
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
    ? `https://gdebenz.ru/?station=${stationKey}&lat=${lat}&lon=${lon}&zoom=17`
    : (lat && lon ? `https://gdebenz.ru/?lat=${lat}&lon=${lon}&zoom=17` : "https://gdebenz.ru");

  return { yandexUrl, twoGisUrl, gdebenzUrl };
}