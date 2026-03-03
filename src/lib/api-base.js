const LOCAL_API_FALLBACK = "http://localhost:999";

const rawApiBase = process.env.NEXT_PUBLIC_API_URL || LOCAL_API_FALLBACK;

export const API_BASE = rawApiBase.replace(/\/+$/, "");

