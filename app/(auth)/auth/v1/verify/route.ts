import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    console.log("token_hash", token_hash);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("error", error);

    if (!error) {
      console.log("redirecting to", next);
      redirect(next);
    }
  }

  redirect("/error");
}
