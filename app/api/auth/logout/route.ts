import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis le token
    const user = verifyToken(request);
    
    if (user) {
      // Récupérer l'IP et le user-agent pour identifier la session
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'Unknown';

      // Désactiver la session 2FA active pour cet appareil
      await prisma.twoFactorSession.updateMany({
        where: {
          userId: user.userId,
          userAgent,
          ip,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      console.log('🔒 [LOGOUT] Session 2FA révoquée pour:', user.email);
    }
  } catch (error) {
    console.error('Erreur lors de la révocation de la session:', error);
  }

  const response = NextResponse.json({ message: 'Déconnexion réussie' });
  
  // Supprimer les cookies d'authentification
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  });
  
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  });

  return response;
} 