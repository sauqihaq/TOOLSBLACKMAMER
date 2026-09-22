// app/api/track/route.js
import { NextResponse } from "next/server";

// Ambil API‑key dari env (tambahkan di Vercel Settings → Environment Variables)
const INSTAGRAM_API_KEY = process.env.INSTAGRAM_API_KEY;
const TIKTOK_API_KEY = process.env.TIKTOK_API_KEY;

// Helper: fetch dengan header lengkap + timeout
async function fetchWithHeaders(url, headers = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Instagram → gunakan RapidAPI (contoh endpoint)
async function getInstagramInfo(username) {
  if (!INSTAGRAM_API_KEY) {
    return { error: "Instagram API key not configured" };
  }

  const url = `https://instagram-data1.p.rapidapi.com/user_info?username=${encodeURIComponent(
    username
  )}`;

  const headers = {
    "x-rapidapi-key": INSTAGRAM_API_KEY,
    "x-rapidapi-host": "instagram-data1.p.rapidapi.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  };

  try {
    const res = await fetchWithHeaders(url, headers);
    if (!res.ok) {
      const txt = await res.text();
      return { error: `Instagram API error ${res.status}: ${txt}` };
    }
    const json = await res.json();
    // Struktur response RapidAPI:
    // { username, full_name, biography, external_url, ... }
    return {
      bio: json.biography || "",
      externalUrl: json.external_url || "",
      fullName: json.full_name || "",
    };
  } catch (e) {
    return { error: `Instagram request failed: ${e.message}` };
  }
}

// TikTok → gunakan RapidAPI (contoh endpoint)
async function getTikTokInfo(username) {
  if (!TIKTOK_API_KEY) {
    return { error: "TikTok API key not configured" };
  }

  const url = `https://tiktok-downloader-download-videos-without-watermark.p.rapidapi.com/user/info?username=${encodeURIComponent(
    username
  )}`;

  const headers = {
    "x-rapidapi-key": TIKTOK_API_KEY,
    "x-rapidapi-host":
      "tiktok-downloader-download-videos-without-watermark.p.rapidapi.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  };

  try {
    const res = await fetchWithHeaders(url, headers);
    if (!res.ok) {
      const txt = await res.text();
      return { error: `TikTok API error ${res.status}: ${txt}` };
    }
    const json = await res.json();
    // Response contoh: { user: { nickname, signature, ... } }
    const info = json.user || {};
    return {
      description: info.signature || "",
      nickname: info.nickname || "",
    };
  } catch (e) {
    return { error: `TikTok request failed: ${e.message}` };
  }
}

// ------------------------------------------------------------------
// Handler utama
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { error: "Missing ?username query param" },
      { status: 400 }
    );
  }

  // Parallel fetch supaya lebih cepat
  const [igInfo, ttInfo] = await Promise.all([
    getInstagramInfo(username),
    getTikTokInfo(username),
  ]);

  // Buat struktur yang UI kamu harapkan
  const response = {
    username,
    scannedAt: new Date().toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    platforms: [
      {
        name: "Instagram",
        info: igInfo.error ? { error: igInfo.error } : igInfo,
      },
      {
        name: "TikTok",
        info: ttInfo.error ? { error: ttInfo.error } : ttInfo,
      },
    ],
    // Contoh placeholder WhatsApp – sesuaikan dengan kebutuhanmu
    contact: {
      whatsapp: `https://wa.me/6281234567890?text=Hi%20${encodeURIComponent(
        username
      )}`,
    },
  };

  return NextResponse.json(response);
}
