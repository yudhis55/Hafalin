'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

      const { data: hafalan, error: hafalanError } = await supabase
        .from('hafalan')
        .select('id, juz, surat, awal_ayat, akhir_ayat, link_hafalan, nilai, komentar')
        .eq('profile_id', profile.id);

      if (hafalanError) {
        setError('Error fetching hafalan: ' + hafalanError.message);
      } else {
        setHafalanList(hafalan as any);
      }
    }
    fetchHafalan();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lihat Hafalan</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hafalanList.map((hafalan) => (
          <HafalanCard key={hafalan.id} hafalan={hafalan} />
        ))}
      </div>
    </div>
  );
}

function HafalanCard({ hafalan }: { hafalan: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [juz, setJuz] = useState(hafalan.juz);
  const [surat, setSurat] = useState(hafalan.surat);
  const [awalAyat, setAwalAyat] = useState(hafalan.awal_ayat);
  const [akhirAyat, setAkhirAyat] = useState(hafalan.akhir_ayat);
  const [linkHafalan, setLinkHafalan] = useState(hafalan.link_hafalan);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    const { error: updateError } = await supabase
      .from('hafalan')
      .update({
        juz,
        surat,
        awal_ayat: awalAyat,
        akhir_ayat: akhirAyat,
        link_hafalan: linkHafalan,
      })
      .eq('id', hafalan.id);

    if (updateError) {
      setError('Error updating hafalan: ' + updateError.message);
    } else {
      setSuccess('Hafalan updated successfully');
      setIsEditing(false);
    }
  };

  const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|&v=|youtu.be\/|\/v\/|shorts\/|\/embed\/|watch\?v=|&v=|watch\?v=|watch\?v=|watch\?v=|watch\?v=|\/embed\/|watch\?v=|watch\?v=|&v=|watch\?v=|v\/|embed\/|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youTubeID = extractYouTubeID(linkHafalan);
  const embedUrl = youTubeID ? `https://www.youtube.com/embed/${youTubeID}` : null;

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
        <h2 className="text-xl font-bold">{`Hafalan Juz ${hafalan.juz}`}</h2>
        <div className="text-sm text-gray-600">
          <p>Surat: {hafalan.surat}</p>
          <p>Awal Ayat: {hafalan.awal_ayat}</p>
          <p>Akhir Ayat: {hafalan.akhir_ayat}</p>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">Nilai</label>
          <input
            type="text"
            value={hafalan.nilai || 'Belum ada nilai'}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            readOnly
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">Komentar</label>
          <textarea
            value={hafalan.komentar || 'Belum ada komentar'}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            readOnly
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Edit
          </button>
        </div>
      </div>
      <div className='p-4'>

      </div>
    </div>
  );
}
