'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import hafalanService from '@/services/hafalan';

const supabase = createClient();

export default function LihatHafalanPage() {
  const [hafalanList, setHafalanList] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHafalan() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('User not logged in');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        setError('Error fetching profile: ' + profileError.message);
        return;
      }

      try {
        const hafalan = await hafalanService.getDaftarHafalanByUser(profile.id);
        setHafalanList(hafalan);
      } catch (error: any) {
        setError('Error fetching hafalan: ' + error.message);
      }
    }
    fetchHafalan();
  }, []);

  const handleUpdate = (id: string, updatedHafalan: any) => {
    setHafalanList((prevList) =>
      prevList.map((hafalan) => (hafalan.id === id ? updatedHafalan : hafalan))
    );
  };

  const handleDelete = (id: string) => {
    setHafalanList((prevList) => prevList.filter((hafalan) => hafalan.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lihat Hafalan</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hafalanList.map((hafalan) => (
          <HafalanCard key={hafalan.id} hafalan={hafalan} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

interface HafalanCardProps {
  hafalan: any;
  onUpdate: (id: string, updatedHafalan: any) => void;
  onDelete: (id: string) => void;
}

function HafalanCard({ hafalan, onUpdate, onDelete }: HafalanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [juz, setJuz] = useState(hafalan.juz);
  const [surat, setSurat] = useState(hafalan.surat);
  const [awalAyat, setAwalAyat] = useState(hafalan.awal_ayat);
  const [akhirAyat, setAkhirAyat] = useState(hafalan.akhir_ayat);
  const [linkHafalan, setLinkHafalan] = useState(hafalan.link_hafalan);
  const [nilai, setNilai] = useState(hafalan.nilai || 0);
  const [komentar, setKomentar] = useState(hafalan.komentar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    const { error: updateError } = await supabase
      .from('hafalan')
      .update({
        juz,
        surat,
        awal_ayat: awalAyat,
        akhir_ayat: akhirAyat,
        link_hafalan: linkHafalan,
        nilai,
        komentar
      })
      .eq('id', hafalan.id);

    if (updateError) {
      setError('Error updating hafalan: ' + updateError.message);
    } else {
      setSuccess('Hafalan updated successfully');
      setIsEditing(false);
      onUpdate(hafalan.id, { ...hafalan, juz, surat, awal_ayat: awalAyat, akhir_ayat: akhirAyat, link_hafalan: linkHafalan, nilai, komentar });
    }
  };

  const handleDelete = async () => {
    try {
      await hafalanService.deleteHafalan(hafalan.id);
      onDelete(hafalan.id);
    } catch (error: any) {
      setError('Error deleting hafalan: ' + error.message);
    }
  };

  const extractYouTubeID = (url: any) => {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|&v=|youtu.be\/|\/v\/|shorts\/|\/embed\/|watch\?v=|&v=|watch\?v=|&v=|watch\?v=|watch\?v=|watch\?v=|watch\?v=|\/embed\/|watch\?v=|watch\?v=|&v=|watch\?v=|v\/|embed\/|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youTubeID = extractYouTubeID(linkHafalan);
  const embedUrl = youTubeID ? `https://www.youtube.com/embed/${youTubeID}` : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Hafalan Juz ${hafalan.juz}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
            <div>
              <label htmlFor="juz" className="block text-sm font-medium text-gray-700">
                Juz
              </label>
              <input
                type="text"
                id="juz"
                value={juz}
                onChange={(e) => setJuz(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="surat" className="block text-sm font-medium text-gray-700">
                Surat
              </label>
              <input
                type="text"
                id="surat"
                value={surat}
                onChange={(e) => setSurat(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="awalAyat" className="block text-sm font-medium text-gray-700">
                Awal Ayat
              </label>
              <input
                type="text"
                id="awalAyat"
                value={awalAyat}
                onChange={(e) => setAwalAyat(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="akhirAyat" className="block text-sm font-medium text-gray-700">
                Akhir Ayat
              </label>
              <input
                type="text"
                id="akhirAyat"
                value={akhirAyat}
                onChange={(e) => setAkhirAyat(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="linkHafalan" className="block text-sm font-medium text-gray-700">
                Link Hafalan
              </label>
              <input
                type="text"
                id="linkHafalan"
                value={linkHafalan}
                onChange={(e) => setLinkHafalan(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="nilai" className="block text-sm font-medium text-gray-700">
                Nilai
              </label>
              <input
                type="number"
                id="nilai"
                value={nilai}
                onChange={(e) => setNilai(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="komentar" className="block text-sm font-medium text-gray-700">
                Komentar
              </label>
              <textarea
                id="komentar"
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
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
            <p>Surat: {hafalan.surat}</p>
            <p>Awal Ayat: {hafalan.awal_ayat}</p>
            <p>Akhir Ayat: {hafalan.akhir_ayat}</p>
            <p>Nilai: {hafalan.nilai}</p>
            <p>Komentar: {hafalan.komentar}</p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
