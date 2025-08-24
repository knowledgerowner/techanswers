import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Créer le contact en base
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'PENDING',
      },
    });

    // Envoyer un email de confirmation
    try {
      const emailResult = await sendContactConfirmationEmail({
        name,
        email,
        subject,
        message,
      });

      if (!emailResult.success) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailResult.error);
        // On continue même si l'email échoue, mais on log l'erreur
      }
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json(
      { message: 'Message envoyé avec succès', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 