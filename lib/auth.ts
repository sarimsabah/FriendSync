import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

//creating a interface for Decoded token
export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

//now we will verify token function
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

//now we will create get token from header function
export function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer")) {
    return null;
  }

  const token = authHeader.substring(7); // this removes first 7 chararcters
  return token;
}

//now here we will create auth middleware function
export function authenticate(request: NextRequest): DecodedToken | null {
  const token = getTokenFromHeader(request);

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded;
}
