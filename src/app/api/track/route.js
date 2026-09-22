import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        // Di sini kita mensimulasikan fetching ke berbagai API (Instagram, Twitter, TikTok)
        // Dalam produksi, kamu bisa menggunakan library seperti 'axios' untuk hit API pihak ketiga.

        const results = await Promise.all([
            fetch(`https://api.instagram.com/v1/?user=${username}`).then(res => res.json()).catch(() => ({ platform: 'Instagram', data: { bio: "Sample IG Bio", followers: 1000 } })),
            fetch(`https://api.twitter.com/2/users_by_username/${username}`).then(res => res.json()).catch(() => ({ platform: 'Twitter', data: { handle: `@${username}`, bio: "Sample Twitter Bio" } })),
        ]);

        // Menggabungkan hasil untuk dikirim ke Frontend
        const finalData = {
            username: username,
            scannedAt: new Date().toLocaleString(),
            platforms: [
                { name: "Instagram", info: results[0].data },
                { name: "Twitter/X", info: results[1].data },
                { name: "TikTok", info: { bio: "Sample TikTok Bio", followers: 5000 } } // Mock data
            ],
            contact: {
                whatsapp: `https://wa.me/628xxxxxx` // Logika deteksi nomor dari bio bisa ditaruh di sini
            }
        };

        return NextResponse.json(finalData);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
