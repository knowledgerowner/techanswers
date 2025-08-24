import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    
    if (!user?.email) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour acheter un article premium' },
        { status: 401 }
      );
    }

    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { error: 'ID de l\'article requis' },
        { status: 400 }
      );
    }

    // Récupérer l'article
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { user: true }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    if (!article.isPremium) {
      return NextResponse.json(
        { error: 'Cet article n\'est pas premium' },
        { status: 400 }
      );
    }

    if (!article.premiumPrice || article.premiumPrice <= 0) {
      return NextResponse.json(
        { error: 'Prix non défini pour cet article' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà acheté cet article
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (dbUser.hasPurchased?.includes(articleId)) {
      return NextResponse.json(
        { error: 'Vous avez déjà acheté cet article' },
        { status: 400 }
      );
    }

    // Construire les URLs de manière robuste
    const baseUrl = getBaseUrl(request);
    
    console.log('Création de session Stripe pour article:', article.title, 'Prix:', article.premiumPrice);
    
    // Créer la session Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: article.title,
              description: article.excerpt || 'Article premium',
              images: article.imageUrl ? [article.imageUrl] : undefined,
            },
            unit_amount: Math.round(article.premiumPrice * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/articles/${article.slug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/articles/${article.slug}?canceled=true`,
      metadata: {
        articleId: articleId,
        userId: dbUser.id,
        userEmail: user.email,
      },
      customer_email: user.email,
    });

    console.log('Session Stripe créée:', stripeSession.id);

    // Créer l'enregistrement de paiement en attente
    await prisma.payment.create({
      data: {
        stripeSessionId: stripeSession.id,
        customerEmail: user.email,
        customerName: dbUser.username || user.email,
        userId: dbUser.id,
        amount: article.premiumPrice,
        currency: 'eur',
        status: 'PENDING',
        description: `Achat de l'article: ${article.title}`,
        articleId: articleId,
        metadata: {
          articleTitle: article.title,
          articleSlug: article.slug,
        }
      }
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
} 