"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";

const signInSchema = z.object({
  email: z.string().email(),
});

export async function signIn(
  formData: FormData
): Promise<{ error?: string; success?: boolean } | void> {
  const validatedFields = signInSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return;
  }

  const { email } = validatedFields.data;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: new URL(
          "/",
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        ).toString(),
      },
    });

    if (error) {
      console.error("Supabase authentication error:", error);
      return { error: error.message };
    }

    console.log("OTP email sent successfully to:", email);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return { error: "Something went wrong" };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}
