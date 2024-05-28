'use client';

import { useState, useEffect } from 'react';
import hafalanService, { Hafalan } from '@/services/hafalan';

export default function HafalanList({ hafalanList }: { hafalanList: Hafalan[] }) {
    const [hafalanData, setHafalanData] = useState<Hafalan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHafalanData = async () => {
            try {
                const data = await hafalanService.getDaftarHafalan();
                setHafalanData(data);
            } catch (error) {
                console.error("Error fetching hafalan data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHafalanData();
    }, []);

    const handleSave = async (id: string, nilai: number, komentar: string) => {
        try {
            await hafalanService.updateHafalan(id, { nilai, komentar });
            const updatedHafalanData = hafalanData.map(hafalan =>
                hafalan.id === id ? { ...hafalan, nilai, komentar } : hafalan
            );
            setHafalanData(updatedHafalanData);
        } catch (error) {
            console.error('Error updating hafalan:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hafalanData.map(hafalan => (
                <HafalanCard key={hafalan.id} hafalan={hafalan} onSave={handleSave} />
            ))}
        </div>
    );
}

interface HafalanCardProps {
    hafalan: Hafalan;
    onSave: (id: string, nilai: number, komentar: string) => void;
}

function getVideoEmbed(videoLink: string) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoLink.match(regex);
    if (match && match[1]) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
}

function HafalanCard({ hafalan, onSave }: HafalanCardProps) {
    const [nilai, setNilai] = useState(hafalan.nilai || 0);
    const [komentar, setKomentar] = useState(hafalan.komentar || '');
    const embedUrl = getVideoEmbed(hafalan.link_hafalan);

    const handleSave = () => {
        onSave(hafalan.id, nilai, komentar);
    };

    return (
        <div className="border rounded-lg shadow-sm overflow-hidden">
            {embedUrl ? (
                <iframe
                    width="100%"
                    height="200"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <p className="text-center text-red-500">Invalid video link</p>
            )}
            <div className="p-4">
                <h2 className="text-xl font-bold">{hafalan.nama_siswa}</h2>
                <div className="text-sm text-gray-600">
                    <p>Juz: {hafalan.juz}</p>
                    <p>Surat: {hafalan.surat}</p>
                    <p>Ayat: {hafalan.awal_ayat} - {hafalan.akhir_ayat}</p>
                    <p>Created At: {new Date(hafalan.created_at).toLocaleDateString()}</p>
                </div>
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Nilai</label>
                    <input
                        type="number"
                        value={nilai}
                        onChange={(e) => setNilai(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Komentar</label>
                    <textarea
                        value={komentar}
                        onChange={(e) => setKomentar(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    ></textarea>
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
