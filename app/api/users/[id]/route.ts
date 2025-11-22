import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get user from database
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, username, full_name, bio, avatar_url, created_at")
    .eq("id", id)
    .single();

  // console.log("user found", user);
  // console.log('error',error);

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user,
  });
}
