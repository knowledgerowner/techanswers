import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createTwoFactorCode, generateTwoFactorEmailHTML } from '@/lib/2fa';
import { sendEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        isAdmin: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si la 2FA est activée
    if (user.twoFactorEnabled) {
      console.log('🔐 [LOGIN] 2FA activée pour l\'utilisateur:', user.email);
      
      try {
        // Créer un code de vérification temporaire
        const twoFactorCode = await createTwoFactorCode(user.id, 'LOGIN');
        
        // Envoyer l'email avec le code
        const subject = 'Code de vérification pour votre connexion - TechAnswers';
        const htmlContent = generateTwoFactorEmailHTML(user.username, twoFactorCode.code, 'LOGIN');
        
        await sendEmail({
          to: user.email,
          subject: subject,
          html: htmlContent
        });

        console.log('📧 [LOGIN] Code 2FA envoyé à:', user.email);

        // Retourner une réponse demandant la vérification 2FA
        return NextResponse.json({
          message: 'Code de vérification envoyé',
          requiresTwoFactor: true,
          userId: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
        });
      } catch (error) {
        console.error('❌ [LOGIN] Erreur lors de l\'envoi du code 2FA:', error);
        return NextResponse.json(
          { error: 'Erreur lors de l\'envoi du code de vérification' },
          { status: 500 }
        );
      }
    }

    // Si pas de 2FA, connecter directement
    console.log('🔐 [LOGIN] Connexion directe pour:', user.email);
    
    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username,
        isAdmin: user.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      isAdmin: user.isAdmin,
    });

    // Définir le cookie JWT
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 