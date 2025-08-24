"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  Euro, 
  Calendar,
  Search,
  Download
} from "lucide-react";

interface Payment {
  id: string;
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  description: string;
  createdAt: string;
  article?: {
    title: string;
    slug: string;
  };
  user?: {
    username: string;
    email: string;
  };
}

interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  topArticles: Array<{
    title: string;
    revenue: number;
    sales: number;
  }>;
  topCustomers: Array<{
    email: string;
    username: string;
    totalSpent: number;
    purchases: number;
  }>;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/payments/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesDate = !dateFilter || payment.createdAt.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'SUCCEEDED': { color: 'bg-green-100 text-green-800', label: 'Réussi' },
      'FAILED': { color: 'bg-red-100 text-red-800', label: 'Échoué' },
      'CANCELED': { color: 'bg-gray-100 text-gray-800', label: 'Annulé' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const exportPayments = () => {
    const csvContent = [
      ['ID', 'Email Client', 'Nom Client', 'Montant', 'Devise', 'Statut', 'Description', 'Date'],
      ...filteredPayments.map(payment => [
        payment.id,
        payment.customerEmail,
        payment.customerName || '',
        payment.amount.toString(),
        payment.currency,
        payment.status,
        payment.description,
        new Date(payment.createdAt).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paiements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics des Paiements</h1>
          <p className="text-muted-foreground">
            Suivez les performances de vos articles premium
          </p>
        </div>
        <Button onClick={exportPayments} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground">
                +{stats.successfulPayments} paiements réussis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements Totaux</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.successfulPayments} réussis, {stats.failedPayments} échoués
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Moyenne</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageOrderValue.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground">
                Par commande
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Uniques</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topCustomers.length}</div>
              <p className="text-xs text-muted-foreground">
                Clients actifs
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Articles les plus vendus */}
      {stats?.topArticles && stats.topArticles.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Articles les Plus Vendus</CardTitle>
            <CardDescription>
              Top 5 des articles générant le plus de revenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {article.sales} ventes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{article.revenue.toFixed(2)} €</div>
                    <p className="text-sm text-muted-foreground">
                      {(article.revenue / article.sales).toFixed(2)} € en moyenne
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher par email, nom ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="SUCCEEDED">Réussi</option>
              <option value="FAILED">Échoué</option>
              <option value="CANCELED">Annulé</option>
            </select>
            
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Paiements</CardTitle>
          <CardDescription>
            {filteredPayments.length} paiements trouvés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.customerName || payment.customerEmail}</div>
                      <div className="text-sm text-muted-foreground">{payment.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {payment.article?.title || payment.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 