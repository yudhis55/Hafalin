'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const supabase = createClient();

export default function LihatHafalanPage() {
  const [hafalanList, setHafalanList] = useState([]);
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

  const extractYouTubeID = (url: any) => {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|&v=|youtu.be\/|\/v\/|shorts\/|\/embed\/|watch\?v=|&v=|watch\?v=|watch\?v=|watch\?v=|watch\?v=|\/embed\/|watch\?v=|watch\?v=|&v=|watch\?v=|v\/|embed\/|shorts\/)([^#\&\?]*).*/;
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
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Surat:</strong> {hafalan.surat}
            </p>
            <p>
              <strong>Awal Ayat:</strong> {hafalan.awal_ayat}
            </p>
            <p>
              <strong>Akhir Ayat:</strong> {hafalan.akhir_ayat}
            </p>
            <p>
              <strong>Link Hafalan:</strong> <a href={hafalan.link_hafalan} target="_blank" className="text-blue-500 hover:underline">{hafalan.link_hafalan}</a>
            </p>
            {embedUrl && (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="560"
                  height="315"
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <p>
              <strong>Nilai:</strong> {hafalan.nilai || 'Belum Dinilai'}
            </p>
            <p>
              <strong>Komentar:</strong> {hafalan.komentar || 'Belum Ada Komentar'}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




// 'use client';

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card2";
// import hafalanService, { Hafalan } from "@/services/hafalan";

// interface HafalanCardProps {
//   hafalan: Hafalan;
//   onUpdate: () => void;
// }

// function extractYouTubeID(url: string) {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
//   const match = url.match(regExp);
//   return match && match[2].length === 11 ? match[2] : null;
// }

// export default function HafalanCard({ hafalan, onUpdate }: HafalanCardProps) {
//   useEffect(() => {
//     console.log("Hafalan props:", hafalan);
//   }, [hafalan]);

//   if (!hafalan) {
//     console.error("Hafalan is undefined");
//     return <div>Loading...</div>;
//   }

//   const [isEditing, setIsEditing] = useState(false);
//   const [juz, setJuz] = useState(hafalan.juz);
//   const [surat, setSurat] = useState<number | 0>(hafalan.surat);
//   const [awalAyat, setAwalAyat] = useState(hafalan.awal_ayat);
//   const [akhirAyat, setAkhirAyat] = useState(hafalan.akhir_ayat);
//   const [linkHafalan, setLinkHafalan] = useState(hafalan.link_hafalan);

//   const handleSubmit = async () => {
//     await hafalanService.updateHafalan(hafalan.id, { juz, surat, awal_ayat: awalAyat, akhir_ayat: akhirAyat, link_hafalan: linkHafalan });
//     setIsEditing(false);
//     onUpdate();
//   };

//   const videoId = extractYouTubeID(linkHafalan);
//   const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSurat(Number(e.target.value)); // Konversikan nilai dari string ke number
//   };


//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Hafalan Juz {hafalan.juz}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {embedUrl && (
//           <div className="mb-4">
//             <iframe
//               width="100%"
//               height="315"
//               src={embedUrl}
//               frameBorder="0"
//               allowFullScreen
//             ></iframe>
//           </div>
//         )}
//         {isEditing ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Juz</label>
//               <input
//                 type="number"
//                 value={juz}
//                 onChange={(e) => setJuz(parseInt(e.target.value))}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Surat</label>
//               <input
//                 type="text"
//                 value={surat}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Awal Ayat</label>
//               <input
//                 type="number"
//                 value={awalAyat}
//                 onChange={(e) => setAwalAyat(parseInt(e.target.value))}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Akhir Ayat</label>
//               <input
//                 type="number"
//                 value={akhirAyat}
//                 onChange={(e) => setAkhirAyat(parseInt(e.target.value))}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Link Hafalan</label>
//               <input
//                 type="text"
//                 value={linkHafalan}
//                 onChange={(e) => setLinkHafalan(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             <p>
//               <strong>Surat:</strong> {hafalan.surat}
//             </p>
//             <p>
//               <strong>Ayat:</strong> {hafalan.awal_ayat} - {hafalan.akhir_ayat}
//             </p>
//             <p>
//               <strong>Link Hafalan:</strong> <a href={hafalan.link_hafalan} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{hafalan.link_hafalan}</a>
//             </p>
//             <p>
//               <strong>Nilai:</strong> {hafalan.nilai || 'Belum Dinilai'}
//             </p>
//             <p>
//               <strong>Komentar:</strong> {hafalan.komentar || 'Belum Ada Komentar'}
//             </p>
//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(true)}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
