export interface StationPriceInfo {
  p: number; // цена
  n?: number;
  t: string; // время обновления цены/отметки (например, "2026-10-26 13:06:28")
}

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
  status?: string | null; // "yes" | "no" | "queue" | "warning" | "empty" | "none" | null
  conflict?: string | null; // "queue" если на АЗС очередь
  dt_only?: number | boolean; // 1 если доступен только дизель
  fuels_now?: string; // строка с текущим топливом: "92,95,95+,ДТ"
  prices_now?: Record<string, StationPriceInfo>; // свежие цены и время
  detail?: string; // свежий комментарий водителя
  confidence_base?: number;
  last_at?: string;
  last_driver_at?: string | null;
  last_auto_at?: string | null;
  price?: string | number | null;
  fuel_class?: string | null;
  class_name?: string | null;
  svc?: string | null;
  svc_fresh?: boolean;
  distance_km?: number;
  confirmations?: number;
  meta?: any;
  svc_only?: boolean;
  [key: string]: any;
}

export type DistrictTab = "nagornaya" | "leninsky";

export type FuelStatusFilter = "all" | "available_only" | "no_queue" | "lukoil" | "gpn" | "teboil";