import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Fonction pour vérifier si l'utilisateur est super admin
async function requireSuperAdminAuth(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    if (!payload.isSuperAdmin) {
      return NextResponse.json({ error: 'Droits super administrateur requis' }, { status: 403 });
    }

    return payload;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 });
  }
}

// PATCH - Basculer le statut administrateur
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireSuperAdminAuth(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { isAdmin } = body;

    // Validation
    if (typeof isAdmin !== 'boolean') {
      return NextResponse.json(
        { error: 'Le statut admin doit être un booléen' },
        { status: 400 }
      );
    }

    // Empêcher de révoquer ses propres droits admin
    if (admin.userId === id && !isAdmin) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas révoquer vos propres droits administrateur' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut admin
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isAdmin },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: isAdmin 
        ? 'Utilisateur promu administrateur avec succès' 
        : 'Droits administrateur révoqués avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la modification du statut admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 