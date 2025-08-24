"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/hooks/useAuth";
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  Monitor,
  Smartphone,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: number;
    views: number;
    visitors: number;
  }>;
  dailyData: Array<{
    date: string;
    views: number;
    visitors: number;
    sessions: number;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est superadmin
  const isSuperAdmin = user?.isSuperAdmin;

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error("Erreur lors du chargement des analytics");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCleanup = async () => {
    if (!confirm('⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer TOUTES les données d\'analytics ?\n\nCette action est irréversible et supprimera définitivement toutes les vues, sessions et métriques.\n\nUn PDF de sauvegarde sera généré avant suppression.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/cleanup', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Nettoyage déclenché avec succès ! ${result.message}`);
        // Recharger les données après le nettoyage
        await loadAnalyticsData();
      } else {
        alert('Erreur lors du déclenchement du nettoyage');
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      alert('Erreur lors du déclenchement du nettoyage');
    } finally {
      setLoading(false);
    }
  };

  const handleStopCleanup = async () => {
    if (!confirm('Êtes-vous sûr de vouloir arrêter le nettoyage automatique des analytics ?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/cleanup/stop', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Nettoyage automatique arrêté avec succès ! ${result.message}`);
      } else {
        alert('Erreur lors de l\'arrêt du nettoyage automatique');
      }
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du nettoyage:', error);
      alert('Erreur lors de l\'arrêt du nettoyage automatique');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/download-pdf', {
        method: 'GET',
      });

      if (response.ok) {
        // Créer un blob et télécharger le PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('PDF téléchargé avec succès !');
      } else {
        alert('Erreur lors du téléchargement du PDF');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Analysez les performances de votre site
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">90 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune donnée disponible</h3>
              <p className="text-muted-foreground mb-4">
                Les analytics commenceront à s&apos;afficher une fois que vous aurez du trafic sur votre site.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>• Visitez quelques pages de votre site pour générer des données</p>
                <p>• Les données apparaîtront après quelques minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Analysez les performances de votre site
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
              </SelectContent>
            </Select>
            {isSuperAdmin && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadPDF}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  📊 Télécharger PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleManualCleanup}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  🗑️ Supprimer TOUTES les analytics
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleStopCleanup}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  🛑 Arrêter auto-nettoyage
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues de pages</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Total sur {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : timeRange === "90d" ? "90" : "365"} jours
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visiteurs uniques</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Sessions uniques
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.sessions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Total des sessions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.avgSessionDuration > 0 
                  ? `${Math.floor(analyticsData.avgSessionDuration / 60)}m ${analyticsData.avgSessionDuration % 60}s`
                  : "0s"
                }
              </div>
              <div className="text-xs text-muted-foreground">
                Taux de rebond: {analyticsData.bounceRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="pages">Pages visitées</TabsTrigger>
            <TabsTrigger value="devices">Appareils</TabsTrigger>
            <TabsTrigger value="sources">Sources de trafic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Graphique des vues quotidiennes */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des vues</CardTitle>
                <CardDescription>
                  Nombre de vues par jour sur les {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : timeRange === "90d" ? "90" : "365"} derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Vues" />
                    <Area type="monotone" dataKey="visitors" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} name="Visiteurs" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Graphique des vues horaires */}
            <Card>
              <CardHeader>
                <CardTitle>Activité horaire</CardTitle>
                <CardDescription>
                  Répartition des vues par heure de la journée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" name="Vues" />
                    <Bar dataKey="visitors" fill="#82ca9d" name="Visiteurs" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages les plus visitées</CardTitle>
                <CardDescription>
                  Top 10 des pages avec le plus de vues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.topPages.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune page visitée pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyticsData.topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{index + 1}</Badge>
                          <div>
                            <div className="font-medium">{page.page}</div>
                            <div className="text-sm text-muted-foreground">
                              Temps moyen: {page.avgTimeOnPage > 0 
                                ? `${Math.floor(page.avgTimeOnPage / 60)}m ${page.avgTimeOnPage % 60}s`
                                : "0s"
                              }
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{page.views.toLocaleString()} vues</div>
                          <div className="text-sm text-muted-foreground">
                            {page.uniqueVisitors.toLocaleString()} visiteurs uniques
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique en camembert des appareils */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par appareil</CardTitle>
                  <CardDescription>
                    Pourcentage de trafic par type d&apos;appareil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.deviceBreakdown.length === 0 ? (
                    <div className="text-center py-8">
                      <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune donnée d&apos;appareil disponible</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ device, percentage }) => `${device}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {analyticsData.deviceBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Liste détaillée des appareils */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails des appareils</CardTitle>
                  <CardDescription>
                    Statistiques détaillées par type d&apos;appareil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.deviceBreakdown.length === 0 ? (
                    <div className="text-center py-8">
                      <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune donnée d&apos;appareil disponible</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analyticsData.deviceBreakdown.map((device) => (
                        <div key={device.device} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(device.device)}
                            <span className="font-medium">{device.device}</span>
                          </div>
                          <Badge variant="outline">{device.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique en camembert des sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Sources de trafic</CardTitle>
                  <CardDescription>
                    Répartition du trafic par source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.trafficSources.length === 0 ? (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune donnée de source disponible</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.trafficSources}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ source, percentage }) => `${source}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {analyticsData.trafficSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Liste détaillée des sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails des sources</CardTitle>
                  <CardDescription>
                    Statistiques détaillées par source de trafic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.trafficSources.length === 0 ? (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune donnée de source disponible</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analyticsData.trafficSources.map((source, index) => (
                        <div key={`${source.source}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Globe className="h-4 w-4" />
                            <span className="font-medium">{source.source}</span>
                          </div>
                          <Badge variant="outline">{source.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 