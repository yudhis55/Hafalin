import React from 'react'

const LihatHafalanPage = () => {
  return (
    <div>
      <h1>Lihat Hafalan</h1>
    </div>
  )
}

export default LihatHafalanPage


// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card2";
// import { updateHafalan } from "@/services/hafalan";
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
//   const [isEditing, setIsEditing] = useState(false);
//   const [juz, setJuz] = useState(hafalan.juz);
//   const [surat, setSurat] = useState(hafalan.surat);
//   const [awalAyat, setAwalAyat] = useState(hafalan.awal_ayat);
//   const [akhirAyat, setAkhirAyat] = useState(hafalan.akhir_ayat);
//   const [linkHafalan, setLinkHafalan] = useState(hafalan.link_hafalan);

//   const handleSubmit = async () => {
//     await updateHafalan(hafalan.id, { juz, surat, awal_ayat: awalAyat, akhir_ayat: akhirAyat, link_hafalan: linkHafalan });
//     setIsEditing(false);
//     onUpdate();
//   };

//   const videoId = extractYouTubeID(linkHafalan);
//   const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

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
//                 onChange={(e) => setSurat(e.target.value)}
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
