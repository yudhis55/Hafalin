import { createClient } from "./client";

const supabase = createClient();

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const signIn = async (email: string, password: string) => {
  await supabase.auth.signInWithPassword({ email, password });
};

export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user", user);
    return user;
  } catch {
    console.error("Error getting current user");
    return null;
  }
}
