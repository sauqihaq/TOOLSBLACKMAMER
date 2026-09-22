"use client";

import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Memanggil API yang kita buat tadi
      const res = await fetch(`/api/track?username=${username}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">Social Tracker</h1>
        <p className="text-center text-gray-500 mb-8">Enter username to find social media info</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="e.g. janesmith"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            {loading ? 'Searching...' : 'Track Username'}
          </button>
        </form>

        {data && (
          <div className="mt-10 space-y-6">
            <div className="border-b pb-2">
                <p className="text-sm text-gray-400">User: <span className="font-bold">{data.username}</span></p>
                <p className="text-xs text-gray-400">Scanned at: {data.scannedAt}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {data.platforms.map((platform, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-blue-500">{platform.name}</h3>
                  <p className="text-sm mt-1">{JSON.stringify(platform.info)}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-600">Contact Info</h3>
                <a href={data.contact.whatsapp} target="_blank" className="text-sm text-blue-600 underline">
                    WhatsApp Link Available
                </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
