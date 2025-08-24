import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/analytics';
import { generateAnalyticsPDF } from '@/lib/pdf-generator';

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin ou superadmin
    
    // Récupérer les données d'analytics
    const analyticsData = await getAnalyticsData(90); // 90 derniers jours
    
    if (analyticsData.pageViews === 0) {
      return NextResponse.json(
        { error: 'Aucune donnée d\'analytics disponible' },
        { status: 404 }
      );
    }
    
    // Générer le PDF
    const pdfBuffer = await generateAnalyticsPDF(analyticsData, 'Rapport Analytics - 90 jours');
    
    // Retourner le PDF en tant que fichier téléchargeable
    const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
    
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Rediriger vers GET pour la compatibilité
  return GET();
} 