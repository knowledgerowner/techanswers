'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Receipt, 
  Download, 
  Eye, 
  Calendar,
  Euro,
  FileText,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import Link from 'next/link';

interface PurchaseHistory {
  id: string;
  articleId: string;
  article: {
    title: string;
    slug: string;
    excerpt?: string;
    imageUrl?: string;
    isPremium: boolean;
    isBilled: boolean;
    premiumPrice: number;
    billedPrice: number;
  };
  price: number;
  currency: string;
  purchaseDate: string;
  accessExpiresAt?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  totalAmount: number;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function BillingPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBillingData = async () => {
    try {
      const [purchasesResponse, invoicesResponse] = await Promise.all([
        fetch('/api/profile/billing/purchases'),
        fetch('/api/profile/billing/invoices')
      ]);

      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setPurchaseHistory(purchasesData.purchases || []);
      }

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData.invoices || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de facturation:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les données de facturation.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/profile/billing/invoices/${invoiceId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addNotification({
          type: 'success',
          title: 'Succès',
          message: 'Facture téléchargée avec succès.',
        });
      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de télécharger la facture.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'succeeded':
        return <Badge className="bg-green-600">Payé</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Échoué</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-600">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
          <p className="text-muted-foreground">
            Gérez vos achats et vos factures
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground">
          Gérez vos achats et vos factures
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Historique des achats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Historique des achats
              </CardTitle>
              <CardDescription>
                Tous vos articles achetés et leur statut d&apos;accès
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchaseHistory.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun achat pour le moment</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n&apos;avez pas encore acheté d&apos;articles premium.
                  </p>
                  <Link href="/articles">
                    <Button>
                      Découvrir nos articles
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">
                              <Link 
                                href={`/articles/${purchase.article.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {purchase.article.title}
                              </Link>
                            </h4>
                            <Badge className="bg-green-600">Payé</Badge>
                          </div>
                          
                          {purchase.article.excerpt && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {purchase.article.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Acheté le {formatDate(purchase.purchaseDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Euro className="h-4 w-4" />
                              {formatCurrency(purchase.price, purchase.currency)}
                            </div>
                            {purchase.accessExpiresAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Expire le {formatDate(purchase.accessExpiresAt)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link href={`/articles/${purchase.article.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Lire
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Factures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Factures
              </CardTitle>
              <CardDescription>
                Toutes vos factures générées automatiquement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune facture</h3>
                  <p className="text-muted-foreground">
                    Vos factures apparaîtront ici après vos achats.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Facture #{invoice.invoiceNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            Créée le {formatDate(invoice.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(invoice.totalAmount, invoice.currency)}
                          </div>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {invoice.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.description}</span>
                            <span>{formatCurrency(item.totalPrice, invoice.currency)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {invoice.dueDate && (
                            <span>Échéance : {formatDate(invoice.dueDate)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/api/profile/billing/invoices/${invoice.id}/pdf`, '_blank')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Résumé de facturation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total des achats</span>
                <span className="font-medium">
                  {formatCurrency(
                    purchaseHistory.reduce((sum, p) => sum + p.price, 0),
                    'eur'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Articles achetés</span>
                <span className="font-medium">{purchaseHistory.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Factures générées</span>
                <span className="font-medium">{invoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Montant total facturé</span>
                <span className="font-medium">
                  {formatCurrency(
                    invoices.reduce((sum, i) => sum + i.totalAmount, 0),
                    'eur'
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Informations de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Paiements sécurisés via Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Factures automatiques</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Accès immédiat après paiement</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>Pas de remboursement automatique</span>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Besoin d&apos;aide ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/contact" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Contacter le support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 