import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAsync } from '@/lib/auth';
import { cleanupAllAnalytics } from '@/lib/analytics-cleanup';

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin ou superadmin
    const admin = await requireAdminAsync(request);
    
    // Vérifier que l'utilisateur est superadmin
    if (!admin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Seuls les superadmins peuvent déclencher le nettoyage des analytics.' },
        { status: 403 }
      );
    }

    // Déclencher le nettoyage complet
    await cleanupAllAnalytics();

    return NextResponse.json({ 
      success: true, 
      message: 'Nettoyage des analytics déclenché avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors du nettoyage des analytics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 