import { NextResponse } from 'next/server';
import { getActiveTimersCount } from '@/lib/2fa-cleanup';

export async function GET() {
  try {
    const timersCount = getActiveTimersCount();
    
    return NextResponse.json({
      activeTimers: timersCount,
      message: `Il y a actuellement ${timersCount} timer(s) 2FA actif(s)`
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des timers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des timers' },
      { status: 500 }
    );
  }
} 