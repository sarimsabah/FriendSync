import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

import bcrypt from "bcryptjs";
import { error } from "console";

export async function POST(request: NextRequest) {
  try{
    const body= await request.json();
    const { email, password, username, full_name } = body;

    if(!email || !password || !username || !full_name){
      return NextResponse.json(
        { error: "Missing required fields"},
        {status: 400}
      )
    }

    const {data: existingUser} = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

      if(existingUser){
        return NextResponse.json(
          { error: "user witht this email alraedy exists"},
          { status: 409}
        )
      }

    const {data: existingUsername} = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

      if(existingUsername){
        return NextResponse.json(
          { error: "username is already there"},
          { status: 409}
        )
      }

      const password_hash = await bcrypt.hash(password, 10); // hash password

      //create user in database
      const {data: newUser, error: insertError} = await supabase
      .from("users")
      .insert([
        { email,
          password_hash,
          username,
          full_name: full_name || null,
        }
      ])
      .select()
      .single()

      if(insertError){
        return NextResponse.json(
          {error: "Error creating user", details: insertError.message},
          { status: 500 }
        )
      }

      const { passsword_hash : _, ...userWithoutPassword } =newUser;

      return NextResponse.json(
        {message: 'user registered successfully', user: userWithoutPassword},
        {status: 201}
      )

  }catch(error : any){
    return NextResponse.json(
      { message: error.message || "Internal Server Error"},
      { status: 500}
    )
  }
}