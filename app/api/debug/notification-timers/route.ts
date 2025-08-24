import { NextResponse } from 'next/server';
import { getActiveNotificationTimersCount } from '@/lib/notification-cleanup';

export async function GET() {
  try {
    const timersCount = getActiveNotificationTimersCount();
    
    return NextResponse.json({
      activeTimers: timersCount,
      message: `Il y a actuellement ${timersCount} timer(s) de notification(s) actif(s)`
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des timers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des timers' },
      { status: 500 }
    );
  }
} 