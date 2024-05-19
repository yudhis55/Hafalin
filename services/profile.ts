import {createClient} from "../utils/supabase/client";

const supabase = createClient();

export type Profile = {
  id: any;
  user_id: any;
  nama: string;
  is_admin: boolean;
  created_at: string;
};

const profileService = {
  async getDaftarProfile() {
    try {
      const { data: profile, error } = await supabase
        .from("profile")
        .select("*");
      if (error) throw error;
      console.log("profile", profile);
      return profile as Profile[];
    } catch (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }
  },

  async getProfile(profileId: string) {
    const { data: profile, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", profileId)
      .single();
    return profile as Profile;
  },

  async addProfile(profileData: any) {
    const { data, error } = await supabase.from("profile").insert(profileData);
    return data;
  },

  async updateProfile(profileId: string, newProfileData: any) {
    try {
      await supabase.from("profile").update(newProfileData).eq("id", profileId);
    } catch {
      console.error("Error updating profile:", newProfileData);
    }
  },

  async deleteProfile(profileId: string) {
    try {
      await supabase.from("profile").delete().eq("id", profileId);
    } catch {
      console.error("Error deleting profile:", profileId);
    }
  },
};

export default profileService;
