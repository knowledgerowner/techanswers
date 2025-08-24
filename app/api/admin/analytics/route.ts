import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin ou superadmin

    // Récupérer le paramètre de période
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    // Convertir la période en nombre de jours
    let days = 30;
    switch (range) {
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
      default:
        days = 30;
    }

    // Récupérer les données d'analytics
    const analyticsData = await getAnalyticsData(days);

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 