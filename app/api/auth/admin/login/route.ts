import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkBruteforceAdvanced, recordFailedAttemptAdvanced, recordSuccessfulAttemptAdvanced, setSessionCookie } from '@/lib/bruteforce';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Vérifier le bruteforce avant tout
    const bruteforceCheck = await checkBruteforceAdvanced(request);
    
    if (bruteforceCheck.blocked) {
      return NextResponse.json(
        { 
          error: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.',
          remainingTime: bruteforceCheck.remainingTime,
          attempts: bruteforceCheck.attempts
        },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      // Enregistrer la tentative échouée
      await recordFailedAttemptAdvanced(request);
      
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!user) {
      // Enregistrer la tentative échouée
      await recordFailedAttemptAdvanced(request);
      
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Enregistrer la tentative échouée
      await recordFailedAttemptAdvanced(request);
      
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est admin ou superadmin
    if (!user.isAdmin && !user.isSuperAdmin) {
      // Enregistrer la tentative échouée
      await recordFailedAttemptAdvanced(request);
      
      return NextResponse.json(
        { error: 'Accès refusé. Droits administrateur requis.' },
        { status: 403 }
      );
    }

    // Connexion réussie - réinitialiser les tentatives
    await recordSuccessfulAttemptAdvanced(request);

    // Créer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Créer la réponse
    const response = NextResponse.json(
      {
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin
        }
      },
      { status: 200 }
    );

    // Définir le cookie admin
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 heures
    });

    // Définir le cookie de session
    setSessionCookie(response);

    return response;

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    
    // Enregistrer la tentative échouée en cas d'erreur
    await recordFailedAttemptAdvanced(request);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 