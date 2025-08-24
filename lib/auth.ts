import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
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
    console.error('Erreur lors de la vérification du token:', error);
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
  
  // Si le token ne contient pas isSuperAdmin (token ancien), 
  // on récupère les informations depuis la base de données
  if (user.isSuperAdmin === undefined) {
    // On va laisser la vérification se faire côté base de données
    // en utilisant requireAuth qui vérifie juste l'authentification
    return user;
  }
  
  if (!user.isAdmin && !user.isSuperAdmin) {
    throw new Error('Droits administrateur requis');
  }
  
  return user;
}

// Version asynchrone qui vérifie dans la base de données pour les tokens anciens
export async function requireAdminAsync(request: NextRequest): Promise<JWTPayload> {
  const user = requireAuth(request);
  
  // Si le token contient isSuperAdmin, on peut vérifier directement
  if (user.isSuperAdmin !== undefined) {
    if (!user.isAdmin && !user.isSuperAdmin) {
      throw new Error('Droits administrateur requis');
    }
    return user;
  }
  
  // Sinon, on vérifie dans la base de données
  const { prisma } = await import('@/lib/prisma');
  const userData = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      isAdmin: true,
      isSuperAdmin: true,
    },
  });
  
  if (!userData) {
    throw new Error('Utilisateur non trouvé');
  }
  
  if (!userData.isAdmin && !userData.isSuperAdmin) {
    throw new Error('Droits administrateur requis');
  }
  
  // Retourner l'utilisateur avec les bonnes informations
  return {
    ...user,
    isAdmin: userData.isAdmin,
    isSuperAdmin: userData.isSuperAdmin,
  };
}

export function requireSuperAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (!user.isSuperAdmin) {
    throw new Error('Droits super administrateur requis');
  }
  return user;
}

// Fonction utilitaire pour vérifier si un utilisateur a les droits d'administration
export function hasAdminRights(user: JWTPayload): boolean {
  return user.isAdmin || user.isSuperAdmin;
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