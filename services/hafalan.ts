import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export type Hafalan = {
  id: string;
  profile_id: string;
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
  async getDaftarHafalan() {
    try {
      const { data: hafalan, error } = await supabase
        .from("hafalan")
        .select("*");
      return hafalan as Hafalan[];
    } catch {
      return [];
    }
  },

  async getHafalan(hafalanId: string) {
    const { data: hafalan, error } = await supabase
      .from("hafalan")
      .select("*")
      .eq("id", hafalanId)
      .single();
    return hafalan as Hafalan;
  },

  async addHafalan(hafalanData: any) {
    try {
      await supabase.from("hafalan").insert(hafalanData);
    } catch {
      console.error("Error adding hafalan:", hafalanData);
    }
  },

  async updateHafalan(hafalanId: string, newHafalanData: any) {
    try {
      await supabase.from("hafalan").update(newHafalanData).eq("id", hafalanId);
    } catch {
      console.error("Error updating hafalan:", newHafalanData);
    }
  },

  async deleteHafalan(hafalanId: string) {
    try{
      await supabase.from("hafalan").delete().eq("id", hafalanId);
    } catch{
      console.error("Error deleting hafalan:", hafalanId);
    }
  },
};

export default hafalanService;
