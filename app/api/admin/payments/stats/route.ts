import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAsync } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Vérifier les droits d'administration
    await requireAdminAsync(request);

    // Récupérer tous les paiements
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    // Calculer les statistiques
    const totalRevenue = payments
      .filter(p => p.status === 'SUCCEEDED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPayments = payments.length;
    const successfulPayments = payments.filter(p => p.status === 'SUCCEEDED').length;
    const failedPayments = payments.filter(p => p.status === 'FAILED').length;
    const averageOrderValue = successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

    // Articles les plus vendus
    const articleStats = new Map<string, { title: string; revenue: number; sales: number }>();
    
    payments
      .filter(p => p.status === 'SUCCEEDED' && p.articleId)
      .forEach(payment => {
        const articleId = payment.articleId!;
        const current = articleStats.get(articleId) || { title: payment.description || '', revenue: 0, sales: 0 };
        current.revenue += payment.amount;
        current.sales += 1;
        articleStats.set(articleId, current);
      });

    const topArticles = Array.from(articleStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Clients les plus actifs
    const customerStats = new Map<string, { email: string; username: string; totalSpent: number; purchases: number }>();
    
    payments
      .filter(p => p.status === 'SUCCEEDED' && p.userId)
      .forEach(payment => {
        const userId = payment.userId!;
        const current = customerStats.get(userId) || { 
          email: payment.customerEmail, 
          username: payment.customerName || payment.customerEmail, 
          totalSpent: 0, 
          purchases: 0 
        };
        current.totalSpent += payment.amount;
        current.purchases += 1;
        customerStats.set(userId, current);
      });

    const topCustomers = Array.from(customerStats.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return NextResponse.json({
      totalRevenue,
      totalPayments,
      successfulPayments,
      failedPayments,
      averageOrderValue,
      topArticles,
      topCustomers,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 