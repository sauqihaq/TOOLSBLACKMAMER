import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        // Contoh jika kamu menggunakan API pihak ketiga (Sesuaikan URL & Key-nya)
        // Jika belum ada provider tetap, kita pakai logic sederhana dulu
        const response = await fetch(`https://api.example.com/social?user=${username}`, {
            headers: {
                'X-RapidAPI-Key': 'ISI_DENGAN_API_KEY_ASLIMU',
                'X-RapidAPI-Host': 'social-media-scraper.p.rapidapi.com'
            }
        });

        const data = await response.json();

        // Logika Fallback: Jika data dari API tidak lengkap, kita isi dengan info dasar
        const processedData = {
            username: username,
            scannedAt: new Date().toLocaleString(),
            platforms: [
                {
                    name: "Instagram",
                    info: data.instagram || { bio: "No Bio Found", follower_count: 0 }
                },
                {
                    name: "TikTok",
                    info: data.tiktok || { description: "Not found" }
                }
            ],
            contact: {
                // Pastikan ini berisi angka saja, tanpa karakter aneh
                whatsapp_number: "6281234567890" // Ganti dengan logic deteksi nomor jika sudah ada
            }
        };

        return NextResponse.json(processedData);

    } catch (error) {
        console.error("Error fetching data:", error);
        // Return data default jika API utama gagal agar tidak 404/500 terus
        return NextResponse.json({
            username: username,
            scannedAt: new Date().toLocaleString(),
            platforms: [
                { name: "Instagram", info: { bio: "Error fetching data from provider" } },
                { name: "TikTok", info: { description: "Error fetching data from provider" } }
            ],
            contact: { whatsapp_number: "6281234567890" }
        });
    }
}
