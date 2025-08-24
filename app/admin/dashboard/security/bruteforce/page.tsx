"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Unlock, 
  Lock, 
  Globe, 
  Monitor, 
  Smartphone,
  Clock,
  MapPin,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BruteforceAttempt {
  id: string;
  ip: string;
  userAgent: string;
  fingerprint: string;
  sessionId?: string;
  attempts: number;
  lastAttempt: string;
  blockedUntil?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  browser?: string;
  os?: string;
  device?: string;
  language?: string;
  timezone?: string;
  screenSize?: string;
  colorDepth?: number;
  pixelRatio?: number;
  canvasFingerprint?: string;
  webglFingerprint?: string;
  headers: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function BruteforcePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [attempts, setAttempts] = useState<BruteforceAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [, setSelectedAttempt] = useState<BruteforceAttempt | null>(null);
  const [unblocking, setUnblocking] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!user.isAdmin && !user.isSuperAdmin) {
        router.push("/");
      } else {
        fetchAttempts();
      }
    }
  }, [user, authLoading, router]);

  const fetchAttempts = async () => {
    try {
      const response = await fetch("/api/admin/security/bruteforce");
      if (response.ok) {
        const data = await response.json();
        setAttempts(data.attempts);
      } else {
        console.error("Erreur lors du chargement des tentatives");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (attemptId: string) => {
    setUnblocking(attemptId);
    try {
      const response = await fetch(`/api/admin/security/bruteforce/${attemptId}/unblock`, {
        method: "POST",
      });

      if (response.ok) {
        setAttempts(prev => 
          prev.map(attempt => 
            attempt.id === attemptId 
              ? { ...attempt, isBlocked: false, blockedUntil: undefined }
              : attempt
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors du déblocage:", error);
    } finally {
      setUnblocking(null);
    }
  };

  const getStatusColor = (attempt: BruteforceAttempt) => {
    if (attempt.isBlocked) return "bg-red-500";
    if (attempt.attempts >= 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = (attempt: BruteforceAttempt) => {
    if (attempt.isBlocked) return "Bloqué";
    if (attempt.attempts >= 5) return "Suspect";
    return "Normal";
  };

  const getDeviceIcon = (device?: string) => {
    if (!device) return <Monitor className="h-4 w-4" />;
    if (device.includes('mobile')) return <Smartphone className="h-4 w-4" />;
    if (device.includes('tablet')) return <Monitor className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = 
      attempt.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.userAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.browser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.os?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "blocked" && attempt.isBlocked) ||
      (statusFilter === "suspicious" && !attempt.isBlocked && attempt.attempts >= 5) ||
      (statusFilter === "normal" && !attempt.isBlocked && attempt.attempts < 5);
    
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sécurité - Tentatives d&apos;intrusion</h1>
          <p className="text-muted-foreground">Surveillez et gérez les tentatives d&apos;accès non autorisées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAttempts}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={logout}>
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{attempts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Bloqués</p>
                <p className="text-2xl font-bold">{attempts.filter(a => a.isBlocked).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Suspects</p>
                <p className="text-2xl font-bold">{attempts.filter(a => !a.isBlocked && a.attempts >= 5).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">IPs uniques</p>
                <p className="text-2xl font-bold">{new Set(attempts.map(a => a.ip)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Rechercher</label>
              <Input
                placeholder="IP, User Agent, Navigateur, OS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="blocked">Bloqués</SelectItem>
                  <SelectItem value="suspicious">Suspects</SelectItem>
                  <SelectItem value="normal">Normaux</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des tentatives */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tentatives d&apos;intrusion ({filteredAttempts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statut</TableHead>
                <TableHead>Adresse IP</TableHead>
                <TableHead>Appareil</TableHead>
                <TableHead>Navigateur/OS</TableHead>
                <TableHead>Tentatives</TableHead>
                <TableHead>Dernière tentative</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>
                    <Badge className={getStatusColor(attempt)}>
                      {getStatusText(attempt)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{attempt.ip}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(attempt.device)}
                      <span className="text-sm">
                        {attempt.device || 'Inconnu'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{attempt.browser || 'Inconnu'}</p>
                      <p className="text-muted-foreground">{attempt.os || 'Inconnu'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-bold text-lg">{attempt.attempts}</span>
                      <p className="text-xs text-muted-foreground">tentatives</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(attempt.lastAttempt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAttempt(attempt)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="max-w-2xl h-screen overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Détails de la tentative</SheetTitle>
                          </SheetHeader>
                          <div className="space-y-6 mt-6">
                            <div className="bg-card border rounded-lg p-4">
                              <h3 className="font-semibold mb-3 text-lg">Informations de base</h3>
                              <div className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Adresse IP:</span>
                                  <span className="font-mono">{attempt.ip}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Statut:</span>
                                  <Badge className={getStatusColor(attempt)}>
                                    {getStatusText(attempt)}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Tentatives:</span>
                                  <span>{attempt.attempts}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Créé le:</span>
                                  <span>{formatDate(attempt.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Dernière tentative:</span>
                                  <span>{formatDate(attempt.lastAttempt)}</span>
                                </div>
                                {attempt.blockedUntil && (
                                  <div className="flex justify-between">
                                    <span className="font-medium text-muted-foreground">Bloqué jusqu&apos;au:</span>
                                    <span>{formatDate(attempt.blockedUntil)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-card border rounded-lg p-4">
                              <h3 className="font-semibold mb-3 text-lg">Informations techniques</h3>
                              <div className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Navigateur:</span>
                                  <span>{attempt.browser || 'Inconnu'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Système d&apos;exploitation:</span>
                                  <span>{attempt.os || 'Inconnu'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Appareil:</span>
                                  <span>{attempt.device || 'Inconnu'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Langue:</span>
                                  <span>{attempt.language || 'Inconnue'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Fuseau horaire:</span>
                                  <span>{attempt.timezone || 'Inconnu'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Résolution écran:</span>
                                  <span>{attempt.screenSize || 'Inconnue'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Profondeur de couleur:</span>
                                  <span>{attempt.colorDepth || 'Inconnue'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-muted-foreground">Ratio de pixels:</span>
                                  <span>{attempt.pixelRatio || 'Inconnu'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-card border rounded-lg p-4">
                              <h3 className="font-semibold mb-3 text-lg">User Agent</h3>
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm font-mono break-all">{attempt.userAgent}</p>
                              </div>
                            </div>

                            <div className="bg-card border rounded-lg p-4">
                              <h3 className="font-semibold mb-3 text-lg">Fingerprints</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Fingerprint principal:</p>
                                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">{attempt.fingerprint}</p>
                                </div>
                                {attempt.canvasFingerprint && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Canvas fingerprint:</p>
                                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">{attempt.canvasFingerprint}</p>
                                  </div>
                                )}
                                {attempt.webglFingerprint && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">WebGL fingerprint:</p>
                                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">{attempt.webglFingerprint}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {attempt.isBlocked && (
                              <div className="bg-card border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-lg">Actions</h3>
                                <Button 
                                  onClick={() => handleUnblock(attempt.id)}
                                  disabled={unblocking === attempt.id}
                                  className="w-full"
                                >
                                  {unblocking === attempt.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Déblocage...
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="mr-2 h-4 w-4" />
                                      Débloquer cette IP
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAttempts.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune tentative d&apos;intrusion trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
} 