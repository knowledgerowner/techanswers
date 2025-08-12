import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.cookies.get('admin-token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = verifyToken(request);
  if (!user) {
    throw new Error('Non authentifié');
  }
  return user;
}

export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (!user.isAdmin) {
    throw new Error('Droits administrateur requis');
  }
  return user;
}

export function getClientFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  
  const fingerprint = crypto
    .createHash("sha256")
    .update(`${userAgent}${acceptLanguage}${acceptEncoding}${ip}`)
    .digest("hex");
  
  return fingerprint;
} 