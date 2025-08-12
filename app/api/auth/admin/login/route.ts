import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getClientFingerprint } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 30; // 30 secondes en dev

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et mot de passe requis' },
        { status: 400 }
      );
    }

    const fingerprint = getClientFingerprint(request);
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    // Vérifier si l'utilisateur est bloqué
    const existingAttempt = await prisma.bruteforceAttempt.findFirst({
      where: {
        OR: [
          { ip },
          { fingerprint }
        ],
        isBlocked: true,
        blockedUntil: {
          gt: new Date()
        }
      }
    });

    if (existingAttempt) {
      return NextResponse.json(
        { 
          error: 'Accès temporairement bloqué',
          isBlocked: true,
          blockedUntil: existingAttempt.blockedUntil
        },
        { status: 429 }
      );
    }

    // Vérifier si l'utilisateur existe et est admin
    const user = await prisma.user.findFirst({
      where: {
        username,
        isAdmin: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        isAdmin: true,
      },
    });

    if (!user) {
      await recordFailedAttempt(ip, fingerprint, userAgent, request.headers);
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await recordFailedAttempt(ip, fingerprint, userAgent, request.headers);
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Connexion réussie - réinitialiser les tentatives
    await prisma.bruteforceAttempt.deleteMany({
      where: {
        OR: [
          { ip },
          { fingerprint }
        ]
      }
    });

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Créer la réponse avec le cookie
    const response = NextResponse.json(
      {
        message: 'Connexion réussie',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    );

    // Définir le cookie admin-token
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 heures
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

async function recordFailedAttempt(
  ip: string, 
  fingerprint: string, 
  userAgent: string, 
  headers: Headers
) {
  try {
    // Trouver ou créer une tentative existante
    const existingAttempt = await prisma.bruteforceAttempt.findFirst({
      where: {
        OR: [
          { ip },
          { fingerprint }
        ]
      }
    });

    const attempts = (existingAttempt?.attempts || 0) + 1;
    const isBlocked = attempts >= MAX_ATTEMPTS;
    const blockedUntil = isBlocked ? new Date(Date.now() + BLOCK_DURATION * 1000) : null;

    // Extraire les informations du navigateur
    const browser = userAgent.includes("Chrome") ? "Chrome" : 
                   userAgent.includes("Firefox") ? "Firefox" : 
                   userAgent.includes("Safari") ? "Safari" : "Unknown";
    
    const os = userAgent.includes("Windows") ? "Windows" : 
               userAgent.includes("Mac") ? "macOS" : 
               userAgent.includes("Linux") ? "Linux" : "Unknown";

    if (existingAttempt) {
      // Mettre à jour la tentative existante
      await prisma.bruteforceAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          attempts,
          lastAttempt: new Date(),
          isBlocked,
          blockedUntil,
          userAgent,
          browser,
          os,
          headers: Object.fromEntries(headers.entries())
        }
      });
    } else {
      // Créer une nouvelle tentative
      await prisma.bruteforceAttempt.create({
        data: {
          ip,
          fingerprint,
          userAgent,
          attempts,
          isBlocked,
          blockedUntil,
          browser,
          os,
          headers: Object.fromEntries(headers.entries())
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la tentative échouée:', error);
  }
} 