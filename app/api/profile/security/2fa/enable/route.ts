import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';


// POST - Activer la 2FA
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { currentPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec le mot de passe hashé
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!userWithPassword) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si la 2FA est déjà activée
    if (userWithPassword.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'La 2FA est déjà activée' },
        { status: 400 }
      );
    }

    // Générer un secret 2FA
    const twoFactorSecret = require('crypto').randomBytes(32).toString('hex'); // eslint-disable-line @typescript-eslint/no-require-imports

    // Activer la 2FA
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret
      }
    });

    // Envoyer le code de vérification par email
    try {
      console.log('🚀 [2FA ENABLE] Début envoi code de vérification');
      
      // Récupérer les cookies de la requête originale
      const cookies = request.headers.get('cookie');
      console.log('🍪 [2FA ENABLE] Cookies récupérés:', cookies ? 'Oui' : 'Non');
      
      const codeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/profile/security/2fa/send-code`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        },
        body: JSON.stringify({ type: 'SETUP' })
      });

      console.log('📡 [2FA ENABLE] Réponse API send-code:', {
        status: codeResponse.status,
        ok: codeResponse.ok
      });

      if (!codeResponse.ok) {
        const errorText = await codeResponse.text();
        console.log('❌ [2FA ENABLE] Erreur réponse:', errorText);
        throw new Error('Erreur lors de l\'envoi du code de vérification');
      }

      const responseData = await codeResponse.json();
      console.log('✅ [2FA ENABLE] Code envoyé avec succès:', responseData);
      
    } catch (codeError) {
      console.error('❌ [2FA ENABLE] Erreur lors de l\'envoi du code:', codeError);
      // Continuer même si l'envoi du code échoue
    }

    return NextResponse.json({
      message: '2FA activée avec succès. Un code de vérification a été envoyé à votre email.',
      requiresVerification: true
    });
  } catch (error) {
    console.error('Erreur lors de l\'activation de la 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 