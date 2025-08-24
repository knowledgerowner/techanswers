import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { cancelCodeCleanup } from '@/lib/2fa-cleanup';

// POST - Vérifier le code 2FA
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Code de vérification requis (6 chiffres)' },
        { status: 400 }
      );
    }

    // Vérifier le code dans la base de données
    const twoFactorCode = await prisma.twoFactorCode.findFirst({
      where: {
        userId: user.userId,
        code,
        type: 'SETUP',
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!twoFactorCode) {
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

    // Créer une session 2FA pour l'appareil actuel
    const sessionId = require('crypto').randomBytes(32).toString('hex'); // eslint-disable-line @typescript-eslint/no-require-imports
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'Unknown';

    await prisma.twoFactorSession.create({
      data: {
        userId: user.userId,
        sessionId,
        deviceName: 'Appareil principal',
        ip,
        userAgent,
        lastUsed: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        isActive: true
      }
    });

    return NextResponse.json({
      message: '2FA activée et vérifiée avec succès',
      sessionId
    });
  } catch (error) {
    console.error('Erreur lors de la vérification 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 