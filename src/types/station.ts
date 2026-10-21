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

export type DistrictTab = "nagornaya" | "leninsky";

export type FuelStatusFilter = "all" | "available_only" | "no_queue" | "lukoil" | "gpn" | "teboil";
