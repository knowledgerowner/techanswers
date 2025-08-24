import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cancelCodeCleanup } from '@/lib/2fa-cleanup';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'ID utilisateur et code requis' },
        { status: 400 }
      );
    }

    console.log('🔐 [2FA VERIFY] Vérification du code pour l\'utilisateur:', userId);

    // Vérifier le code dans la base de données
    const twoFactorCode = await prisma.twoFactorCode.findFirst({
      where: {
        userId: userId,
        code: code,
        type: 'LOGIN',
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!twoFactorCode) {
      console.log('❌ [2FA VERIFY] Code invalide ou expiré');
      return NextResponse.json(
        { error: 'Code de vérification invalide ou expiré' },
        { status: 400 }
      );
    }

    // Marquer le code comme utilisé
    await prisma.twoFactorCode.update({
      where: { id: twoFactorCode.id },
      data: { used: true }
    });

    // Annuler le timer de nettoyage automatique
    cancelCodeCleanup(twoFactorCode.id);

    // Récupérer les informations utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Créer une session 2FA pour l'appareil actuel
    const sessionId = require('crypto').randomBytes(32).toString('hex'); // eslint-disable-line @typescript-eslint/no-require-imports
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'Unknown';

    await prisma.twoFactorSession.create({
      data: {
        userId: user.id,
        sessionId,
        deviceName: 'Appareil principal',
        ip,
        userAgent,
        lastUsed: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        isActive: true
      }
    });

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ [2FA VERIFY] Connexion 2FA réussie pour:', user.email);

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      message: 'Connexion 2FA réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
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
    console.error('❌ [2FA VERIFY] Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 