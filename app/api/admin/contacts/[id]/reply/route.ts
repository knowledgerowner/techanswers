import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReplyEmail } from '@/lib/email';
import { requireAdminAsync } from '@/lib/auth';

// POST - Ajouter une réponse à un contact
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireAdminAsync(request);
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

    // Récupérer le nom d'utilisateur de l'admin
    const adminUser = await prisma.user.findUnique({
      where: { id: admin.userId },
      select: { username: true },
    });

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
          adminName: adminUser?.username || 'Admin',
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