import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// DELETE - Supprimer un abonnement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  try {
    const { subscriptionId } = await params;
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    // Vérifier que l'abonnement appartient à l'utilisateur
    const subscription = await prisma.categorySubscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.userId
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonnement non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'abonnement
    await prisma.categorySubscription.delete({
      where: {
        id: subscriptionId,
        userId: user.userId
      }
    });

    return NextResponse.json({
      message: 'Abonnement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 