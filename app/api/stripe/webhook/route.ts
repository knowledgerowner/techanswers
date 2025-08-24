export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { createInvoiceFromPayment } from '@/lib/invoice-generator';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const isProd = process.env.NODE_ENV === 'production';
const skipSignature = !isProd && (process.env.SKIP_STRIPE_SIGNATURE === 'true' || !endpointSecret);
console.log('Webhook secret configuré:', endpointSecret ? 'Oui' : 'Non');

export async function POST(request: NextRequest) {
  console.log('Webhook reçu');
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  console.log('Signature webhook:', sig ? 'Présente' : 'Absente');
  console.log('Body length:', body.length);

  let event: Stripe.Event;

  if (skipSignature || !sig) {
    try {
      event = JSON.parse(body) as Stripe.Event;
      console.log('Webhook sans vérification de signature (dev). Type:', event.type);
    } catch (err) {
      console.error('Corps JSON invalide:', err);
      return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
      console.log('Événement webhook validé:', event.type);
    } catch (err) {
      console.error('Erreur de signature webhook:', err);
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(failedPaymentIntent);
        break;
      
      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { articleId, userId, userEmail } = session.metadata || {};
  
  if (!articleId || !userId || !userEmail) {
    console.error('Métadonnées manquantes dans la session:', session.metadata);
    return;
  }

  try {
    // Mettre à jour le statut du paiement
    await prisma.payment.updateMany({
      where: { stripeSessionId: session.id, status: 'PENDING' },
      data: {
        status: 'SUCCEEDED',
        stripePaymentIntentId: session.payment_intent as string,
      }
    });

    // Ajouter l'article à la liste des articles achetés de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { hasPurchased: true }
    });

    if (!user) {
      console.error('Utilisateur introuvable pour userId:', userId);
      return;
    }
    const updatedHasPurchased = [...(user.hasPurchased || []), articleId];
    await prisma.user.update({
      where: { id: userId },
      data: {
        hasPurchased: updatedHasPurchased
      }
    });

    // Créer automatiquement la facture
    if (session.payment_intent && session.amount_total) {
      const amount = session.amount_total / 100; // Stripe utilise les centimes
      await createInvoiceFromPayment(
        userId,
        articleId,
        session.payment_intent as string,
        amount,
        session.currency || 'eur'
      );
    }

    console.log(`Accès accordé à l'article ${articleId} pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des accès:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Mettre à jour le statut du paiement si pas déjà fait
    await prisma.payment.updateMany({
      where: { 
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING'
      },
      data: {
        status: 'SUCCEEDED'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Mettre à jour le statut du paiement
    await prisma.payment.updateMany({
      where: { 
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING'
      },
      data: {
        status: 'FAILED'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement échoué:', error);
  }
} 