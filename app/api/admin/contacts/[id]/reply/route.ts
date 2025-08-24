import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReplyEmail } from '@/lib/email';
import { verifyToken } from '@/lib/auth';

// Fonction pour vérifier si l'utilisateur est admin
async function requireAdmin(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    if (!payload.isAdmin && !payload.isSuperAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return payload;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 });
  }
}

// POST - Ajouter une réponse à un contact
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Le contenu de la réponse est requis' },
        { status: 400 }
      );
    }

    // Vérifier que le contact existe
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      );
    }

    // Créer la réponse
    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        contactId: id,
        userId: admin.userId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    // Mettre à jour le statut du contact en "En cours" si c'était "En attente"
    if (contact.status === 'PENDING') {
      await prisma.contact.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    // Envoyer l'email de réponse
    try {
      const emailResult = await sendReplyEmail(
        {
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
        },
        {
          content: content.trim(),
          adminName: admin.username,
        }
      );

      if (!emailResult.success) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailResult.error);
        // On continue même si l'email échoue, mais on log l'erreur
      }
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la réponse:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 