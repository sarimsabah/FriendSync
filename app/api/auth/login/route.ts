import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Some fields are missing" },
        { status: 400 }
      );
    }

    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    //checking if user exists
    if (!user || dbError) {
      console.error('Login error - user not found:', dbError);
      return NextResponse.json(
        { error: "Email or password doesn't exist" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    //checking if password is valid
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email or password doesn't exist" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // removing password from user object, not showing hashed password to user
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login Successfully Done",
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}
