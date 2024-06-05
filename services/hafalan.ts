import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export type Hafalan = {
  id: string;
  profile_id: string;
  nama_siswa: string;
  juz: number;
  surat: number;
  awal_ayat: number;
  akhir_ayat: number;
  nilai: number;
  komentar: string;
  created_at: string;
  link_hafalan: string;
};

const hafalanService = {
  async getTotalHafalan() {
    const { count, error } = await supabase
      .from("hafalan")
      .select("*", { count: "exact" });

    if (error) throw error;
    return count || 0;
  },
  async getDaftarHafalan() {
    try {
      const { data: hafalan, error } = await supabase
        .from("hafalan")
        // .select(`*, profile(nama)`);
        .select(
          `id, profile_id, juz, surat, awal_ayat, akhir_ayat, nilai, komentar, created_at, link_hafalan, profile(nama)`
        );

      if (error) throw error;

      // Mapping untuk menambahkan nama_siswa ke objek hafalan
      const mappedHafalan = hafalan.map((item: any) => ({
        ...item,
        // nama_siswa: item.profile.nama,
        nama_siswa: item.profile ? item.profile.nama : "Unknown",
      }));

      return mappedHafalan as Hafalan[];
    } catch (error) {
      console.error("Error fetching hafalan:", error);
      return [];
    }
  },

  async getPeringkatHafalan() {
    try {
      const { data: hafalan, error } = await supabase
        .from("hafalan")
        .select("profile_id, profile(nama), id");

      if (error) throw error;

      // Kelompokkan hafalan berdasarkan profile_id dan hitung jumlah hafalan untuk setiap profile
      const peringkat = hafalan.reduce((acc: any, curr: any) => {
        const existing = acc.find(
          (item: any) => item.profile_id === curr.profile_id
        );
        if (existing) {
          existing.jumlah_hafalan++;
        } else {
          acc.push({
            profile_id: curr.profile_id,
            nama: curr.profile.nama,
            jumlah_hafalan: 1,
          });
        }
        return acc;
      }, []);

      // Urutkan peringkat berdasarkan jumlah hafalan
      peringkat.sort((a: any, b: any) => b.jumlah_hafalan - a.jumlah_hafalan);

      return peringkat;
    } catch (error) {
      console.error("Error fetching peringkat hafalan:", error);
      return [];
    }
  },

  // Metode untuk mendapatkan daftar hafalan berdasarkan ID pengguna
  async getDaftarHafalanByUser(profileId: string) {
    try {
      const { data: hafalan, error } = await supabase
        .from("hafalan")
        .select(
          `id, profile_id, juz, surat, awal_ayat, akhir_ayat, nilai, komentar, created_at, link_hafalan, profile(nama)`
        )
        .eq("profile_id", profileId);

      if (error) throw error;

      const mappedHafalan = hafalan.map((item: any) => ({
        ...item,
        nama_siswa: item.profile ? item.profile.nama : "Unknown",
      }));

      return mappedHafalan as Hafalan[];
    } catch (error) {
      console.error("Error fetching hafalan:", error);
      return [];
    }
  },

  async getHafalan(hafalanId: string) {
    const { data: hafalan, error } = await supabase
      .from("hafalan")
      .select(`*, profile(nama)`)
      .eq("id", hafalanId)
      .single();

    if (error) throw error;

    // Menambahkan nama_siswa ke objek hafalan
    const mappedHafalan = hafalan.map((item: any) => ({
      ...item,
      nama_siswa: item.profile ? item.profile.nama : "Unknown",
    }));

    return mappedHafalan as Hafalan;
  },

  async addHafalan(hafalanData: any) {
    try {
      await supabase.from("hafalan").insert(hafalanData);
    } catch (error) {
      console.error("Error adding hafalan:", hafalanData, error);
    }
  },

  async updateHafalan(hafalanId: string, newHafalanData: any) {
    try {
      await supabase.from("hafalan").update(newHafalanData).eq("id", hafalanId);
    } catch (error) {
      console.error("Error updating hafalan:", newHafalanData, error);
    }
  },

  async deleteHafalan(hafalanId: string) {
    try {
      await supabase.from("hafalan").delete().eq("id", hafalanId);
    } catch (error) {
      console.error("Error deleting hafalan:", hafalanId, error);
    }
  },
};

export default hafalanService;
