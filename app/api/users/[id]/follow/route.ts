// follow and unfollow endpoints

import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // AWAIT params
  const { id: followingId } = await params;

  // Authenticate user
  const user = authenticate(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized - Please login" },
      { status: 401 }
    );
  }

  // Can't follow yourself
  if (user.userId === followingId) {
    return NextResponse.json(
      { error: "You cannot follow yourself" },
      { status: 400 }
    );
  }

  // Check if user exists
  const { data: targetUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", followingId)
    .single();

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.userId)
    .eq("following_id", followingId)
    .single();

  if (existingFollow) {
    return NextResponse.json(
      { error: "Already following this user" },
      { status: 409 }
    );
  }

  // Create follow relationship
  const { error } = await supabase.from("follows").insert([
    {
      follower_id: user.userId,
      following_id: followingId,
    },
  ]);

  if (error) {
    return NextResponse.json(
      { error: "Failed to follow user", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Successfully followed user",
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // AWAIT params
  const { id: followingId } = await params;

  // Authenticate user
  const user = authenticate(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized - Please login" },
      { status: 401 }
    );
  }

  // Delete follow relationship
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.userId)
    .eq("following_id", followingId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to unfollow user", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Successfully unfollowed user",
  });
}
