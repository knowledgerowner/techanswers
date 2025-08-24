'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState<'success' | 'canceled' | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      setStatus('success');
      setShowStatus(true);
    } else if (canceled === 'true') {
      setStatus('canceled');
      setShowStatus(true);
    }
  }, [searchParams]);

  if (!showStatus) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Paiement Réussi !
              </CardTitle>
              <CardDescription>
                Votre achat a été confirmé. Vous avez maintenant accès à l&apos;article.
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-yellow-600">
                Paiement Annulé
              </CardTitle>
              <CardDescription>
                Le paiement a été annulé. Vous pouvez réessayer à tout moment.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">Accès accordé</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Vous pouvez maintenant lire l&apos;article complet et accéder à tous les commentaires.
              </p>
            </div>
          )}

          {status === 'canceled' && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700">
                <X className="w-4 h-4" />
                <span className="font-medium">Aucun montant débité</span>
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                Aucun montant n&apos;a été débité de votre compte. Vous pouvez réessayer quand vous le souhaitez.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={() => setShowStatus(false)}
              className="flex-1"
            >
              Fermer
            </Button>
            <Link href="/articles">
              <Button variant="outline" className="flex-1">
                Voir les articles
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 