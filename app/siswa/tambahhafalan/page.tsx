'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase/client';

export default function TambahHafalanPage() {
    const router = useRouter();
    const [juz, setJuz] = useState('');
    const [surat, setSurat] = useState('');
    const [awalAyat, setAwalAyat] = useState('');
    const [akhirAyat, setAkhirAyat] = useState('');
    const [linkHafalan, setLinkHafalan] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError('User not logged in');
            return;
        }

        // Fetch the profile ID associated with the logged-in user
        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            setError('Error fetching profile: ' + profileError.message);
            return;
        }

        const { data, error: insertError } = await supabase
            .from('hafalan')
            .insert([
                {
                    profile_id: profile.id, // Use profile.id instead of user.id
                    juz,
                    surat,
                    awal_ayat: awalAyat,
                    akhir_ayat: akhirAyat,
                    link_hafalan: linkHafalan,
                },
            ]);

        if (insertError) {
            setError('Error inserting data: ' + insertError.message);
        } else {
            setSuccess('Hafalan successfully submitted');
            setJuz('');
            setSurat('');
            setAwalAyat('');
            setAkhirAyat('');
            setLinkHafalan('');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tambah Hafalan</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
