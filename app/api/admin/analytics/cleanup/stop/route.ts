import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAsync } from '@/lib/auth';
import { stopAnalyticsCleanup } from '@/lib/analytics-cleanup';

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin ou superadmin
    const admin = await requireAdminAsync(request);
    
    // Vérifier que l'utilisateur est superadmin
    if (!admin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Seuls les superadmins peuvent arrêter le nettoyage automatique.' },
        { status: 403 }
      );
    }

    // Arrêter le nettoyage automatique
    stopAnalyticsCleanup();

    return NextResponse.json({ 
      success: true, 
      message: 'Nettoyage automatique des analytics arrêté avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'arrêt du nettoyage automatique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 