"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  CreditCard, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  TrendingUp,
  Calendar,
  Tag,
  Newspaper,
  Eye,
  Clock,
  MousePointer,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import {
  LineChart,
  Line,
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
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        if (userData.isAdmin) {
          setUser(userData);
        } else {
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des analytics:", error);
      // Données de démonstration
      setAnalyticsData(getDemoData());
    }
  };

  const getDemoData = (): AnalyticsData => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 1;
    const dailyData = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      return {
        date: format(date, "dd/MM", { locale: fr }),
        views: Math.floor(Math.random() * 1000) + 500,
        visitors: Math.floor(Math.random() * 300) + 150,
        sessions: Math.floor(Math.random() * 400) + 200,
      };
    });

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      views: Math.floor(Math.random() * 100) + 20,
      visitors: Math.floor(Math.random() * 30) + 10,
    }));

    return {
      pageViews: 15420,
      uniqueVisitors: 3240,
      sessions: 4560,
      avgSessionDuration: 245,
      bounceRate: 32.5,
      topPages: [
        { page: "/", views: 5420, uniqueVisitors: 3240, avgTimeOnPage: 180 },
        { page: "/articles", views: 3200, uniqueVisitors: 2100, avgTimeOnPage: 320 },
        { page: "/about", views: 1200, uniqueVisitors: 980, avgTimeOnPage: 120 },
        { page: "/contact", views: 800, uniqueVisitors: 650, avgTimeOnPage: 90 },
      ],
      deviceBreakdown: [
        { device: "Desktop", percentage: 65 },
        { device: "Mobile", percentage: 30 },
        { device: "Tablet", percentage: 5 },
      ],
      trafficSources: [
        { source: "Direct", percentage: 45 },
        { source: "Google", percentage: 35 },
        { source: "Social Media", percentage: 15 },
        { source: "Other", percentage: 5 },
      ],
      hourlyData,
      dailyData,
    };
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

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

  if (!user) {
    return null;
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar className="hidden lg:flex" />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-3/4 border-r bg-background">
          <AdminSidebar className="w-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-[60px] items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Analysez les performances de votre site
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="mb-6">
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList>
                  <TabsTrigger value="1d">Aujourd'hui</TabsTrigger>
                  <TabsTrigger value="7d">7 jours</TabsTrigger>
                  <TabsTrigger value="30d">30 jours</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {analyticsData && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pages vues</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% par rapport à la période précédente
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Visiteurs uniques</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +12.3% par rapport à la période précédente
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.sessions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +8.7% par rapport à la période précédente
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.floor(analyticsData.avgSessionDuration / 60)}m {analyticsData.avgSessionDuration % 60}s</div>
                      <p className="text-xs text-muted-foreground">
                        Taux de rebond: {analyticsData.bounceRate}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Daily Traffic Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Trafic quotidien</CardTitle>
                      <CardDescription>
                        Évolution des vues et visiteurs au fil du temps
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
                          <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                          <Area type="monotone" dataKey="visitors" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Hourly Traffic Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Trafic horaire</CardTitle>
                      <CardDescription>
                        Répartition des visites par heure
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
                          <Bar dataKey="views" fill="#8884d8" />
                          <Bar dataKey="visitors" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Device and Source Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Device Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Appareils</CardTitle>
                      <CardDescription>
                        Répartition par type d'appareil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.deviceBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ device, percentage }) => `${device} ${percentage}%`}
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
                    </CardContent>
                  </Card>

                  {/* Traffic Sources */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sources de trafic</CardTitle>
                      <CardDescription>
                        D'où viennent vos visiteurs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.trafficSources}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ source, percentage }) => `${source} ${percentage}%`}
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
                    </CardContent>
                  </Card>
                </div>

                {/* Top Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pages les plus visitées</CardTitle>
                    <CardDescription>
                      Les pages qui génèrent le plus de trafic
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPages.map((page, index) => (
                        <div key={page.page} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{page.page}</p>
                              <p className="text-sm text-muted-foreground">
                                {page.uniqueVisitors} visiteurs uniques
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{page.views.toLocaleString()} vues</p>
                            <p className="text-sm text-muted-foreground">
                              {Math.floor(page.avgTimeOnPage / 60)}m {page.avgTimeOnPage % 60}s en moyenne
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 