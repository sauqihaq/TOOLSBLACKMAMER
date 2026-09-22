"use client";
import { useState } from 'react';
import { Search, User, MapPin, Phone, Globe } from 'lucide-react';

export default function TrackerPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleTrack = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/track?username=${username}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error tracking:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">Social Intelligence</h1>
          <p className="text-gray-600">Track and analyze any social media user instantly.</p>
        </header>

        {/* Search Bar */}
        <div className="flex gap-4 justify-center mb-12">
          <input
            type="text"
            placeholder="Enter username (e.g. @budi_jkt)"
            className="p-4 border-2 border-blue-200 rounded-xl w-full max-w-md focus:outline-none focus:border-blue-500 text-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition"
          >
            {loading ? "Analyzing..." : <><Search size={20}/> Track Now</>}
          </button>
        </div>

        {/* Results Area */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Summary Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User /> Identity</h2>
              <p className="text-gray-500 italic text-sm">Target Username</p>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">@{data.username}</p>
              <div className="mt-4 text-xs text-gray-400">Scanned: {data.scannedAt}</div>
            </div>

            {/* Platform Cards */}
            {data.platforms.map((plat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">{plat.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {JSON.stringify(plat.info)}
                </p>
              </div>
            ))}

            {/* Contact Card */}
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white md:col-span-3 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Phone /> Contact Info</h3>
                <p className="opacity-80">Found link via social media analysis</p>
              </div>
              <a
                href={data.contact.whatsapp}
                target="_blank"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Contact via WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Placeholder if no search yet */}
        {!data && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-3xl">
            <p className="text-gray-400 text-lg italic">Type a username and click Track to see the magic.</p>
          </div>
        )}
      </div>
    </div>
  );
}