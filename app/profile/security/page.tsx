'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Smartphone,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/contexts/NotificationContext';

interface TwoFactorSession {
  id: string;
  sessionId: string;
  deviceName: string;
  ip: string;
  lastUsed: string;
  expiresAt: string;
  isActive: boolean;
}

export default function SecurityPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const [sessions, setSessions] = useState<TwoFactorSession[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    if (user) {
      const enabled = user.twoFactorEnabled || false;
      setTwoFactorEnabled(enabled);
      console.log('🔐 [SECURITY] 2FA status:', enabled);
      fetchSecurityData();
    }
  }, [user]);

  const fetchSecurityData = async () => {
    try {
      const response = await fetch('/api/profile/security/sessions');
      if (response.ok) {
        const sessionsData = await response.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error);
    }
  };

  const handleEnable2FA = async () => {
    if (!currentPassword) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez entrer votre mot de passe actuel.',
      });
      return;
    }

    setIsSettingUp(true);
    try {
      const response = await fetch('/api/profile/security/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword }),
      });

      if (response.ok) {
        // Mettre à jour l'état local immédiatement
        setTwoFactorEnabled(true);
        addNotification({
          type: 'success',
          title: '2FA activée',
          message: 'Un code de vérification a été envoyé à votre email.',
        });
        setCurrentPassword('');
        
        // Envoyer automatiquement le code de vérification
        try {
          const codeResponse = await fetch('/api/profile/security/2fa/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'SETUP' })
          });
          
          if (codeResponse.ok) {
            addNotification({
              type: 'success',
              title: 'Code envoyé',
              message: 'Le code de vérification a été envoyé à votre email.',
            });
          } else {
            addNotification({
              type: 'warning',
              title: 'Code non envoyé',
              message: 'La 2FA est activée mais le code n\'a pas pu être envoyé. Vérifiez votre email ou réessayez.',
            });
          }
        } catch (codeError) {
          console.error('Erreur lors de l\'envoi du code:', codeError);
          addNotification({
            type: 'warning',
            title: 'Code non envoyé',
            message: 'La 2FA est activée mais le code n\'a pas pu être envoyé. Vérifiez votre email ou réessayez.',
          });
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'activation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de la 2FA:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Impossible d\'activer la 2FA.',
      });
      // Remettre isSettingUp à false seulement en cas d'erreur
      setIsSettingUp(false);
    }
    // Ne pas remettre isSettingUp à false en cas de succès pour garder le formulaire de vérification
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez entrer un code de vérification à 6 chiffres.',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/profile/security/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (response.ok) {
        setTwoFactorEnabled(true);
        setVerificationCode('');
        setIsSettingUp(false); // Remettre isSettingUp à false après vérification réussie
        addNotification({
          type: 'success',
          title: '2FA activée',
          message: 'L\'authentification à deux facteurs est maintenant active sur votre compte.',
        });
        // Mettre à jour les données utilisateur localement
        if (user) {
          user.twoFactorEnabled = true;
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Code de vérification incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la désactivation de la 2FA:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Code de vérification incorrect.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!currentPassword) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez entrer votre mot de passe actuel.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/security/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword }),
      });

      if (response.ok) {
        setTwoFactorEnabled(false);
        setCurrentPassword('');
        addNotification({
          type: 'success',
          title: '2FA désactivée',
          message: 'L\'authentification à deux facteurs a été désactivée.',
        });
        // Mettre à jour les données utilisateur localement
        if (user) {
          user.twoFactorEnabled = false;
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la désactivation');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Impossible de désactiver la 2FA.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/profile/security/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        addNotification({
          type: 'success',
          title: 'Session révoquée',
          message: 'La session a été révoquée avec succès.',
        });
      } else {
        throw new Error('Erreur lors de la révocation');
      }
    } catch (error) {
      console.error('Erreur lors de la révocation de la session:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de révoquer la session.',
      });
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const response = await fetch('/api/profile/security/sessions', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions([]);
        addNotification({
          type: 'success',
          title: 'Sessions révoquées',
          message: 'Toutes les sessions ont été révoquées.',
        });
      } else {
        throw new Error('Erreur lors de la révocation');
      }
    } catch (error) {
      console.error('Erreur lors de la révocation des sessions:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de révoquer toutes les sessions.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sécurité</h1>
        <p className="text-muted-foreground">
          Gérez la sécurité de votre compte et l&apos;authentification à deux facteurs
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Authentification à deux facteurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentification à deux facteurs (2FA)
              </CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statut actuel */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {twoFactorEnabled ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {twoFactorEnabled ? '2FA activée' : '2FA non activée'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? 'Votre compte est protégé par l\'authentification à deux facteurs'
                        : 'Activez la 2FA pour sécuriser votre compte'
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={twoFactorEnabled ? "default" : "outline"}>
                  {twoFactorEnabled ? 'Sécurisé' : 'Non sécurisé'}
                </Badge>
              </div>

              {!twoFactorEnabled ? (
                /* Configuration de la 2FA */
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative mt-2">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleEnable2FA} 
                    disabled={isSettingUp || !currentPassword}
                    className="w-full"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isSettingUp ? 'Activation...' : 'Activer la 2FA'}
                  </Button>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">Comment fonctionne la 2FA ?</p>
                        <p>Un code de vérification à 6 chiffres sera envoyé à votre email à chaque connexion.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Désactivation de la 2FA */
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="disablePassword">Mot de passe actuel</Label>
                    <div className="relative mt-2">
                      <Input
                        id="disablePassword"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDisable2FA} 
                    disabled={isLoading || !currentPassword}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    {isLoading ? 'Désactivation...' : 'Désactiver la 2FA'}
                  </Button>

                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-medium mb-1">Attention</p>
                        <p>Désactiver la 2FA réduira la sécurité de votre compte.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vérification du code (si en cours d'activation) */}
              {isSettingUp && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium">Vérification du code</h4>
                  <p className="text-sm text-muted-foreground">
                    Un code de vérification à 6 chiffres a été envoyé à votre email.
                  </p>
                  <div>
                    <Label htmlFor="verificationCode">Code de vérification</Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="mt-2 text-center text-lg tracking-widest"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleVerify2FA} 
                      disabled={isVerifying || verificationCode.length !== 6}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isVerifying ? 'Vérification...' : 'Vérifier et activer'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/profile/security/2fa/send-code', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'SETUP' })
                          });
                          
                          if (response.ok) {
                            addNotification({
                              type: 'success',
                              title: 'Code renvoyé',
                              message: 'Un nouveau code de vérification a été envoyé à votre email.',
                            });
                          } else {
                            throw new Error('Erreur lors de l\'envoi');
                          }
                        } catch (error) {
                          console.error('Erreur lors de l\'envoi du code:', error);
                          addNotification({
                            type: 'error',
                            title: 'Erreur',
                            message: 'Impossible de renvoyer le code. Veuillez réessayer.',
                          });
                        }
                      }}
                      className="px-4"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Vous n&apos;avez pas reçu le code ? Cliquez sur le bouton de rafraîchissement pour le renvoyer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sessions actives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Sessions actives
              </CardTitle>
              <CardDescription>
                Gérez vos sessions de connexion actives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune session active</h3>
                  <p className="text-muted-foreground">
                    Vous n&apos;avez pas de sessions de connexion actives.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{session.deviceName || 'Appareil inconnu'}</h4>
                          {session.isActive && (
                            <Badge className="bg-green-600">Active</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>IP: {session.ip}</p>
                          <p>Dernière utilisation: {formatDate(session.lastUsed)}</p>
                          <p>Expire le: {formatDate(session.expiresAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Révoquer
                      </Button>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRevokeAllSessions}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Révoquer toutes les sessions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Statut de sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA activée</span>
                <Badge variant={twoFactorEnabled ? "default" : "outline"}>
                  {twoFactorEnabled ? "Oui" : "Non"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sessions actives</span>
                <span className="font-medium">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dernière connexion</span>
                <span className="text-xs text-muted-foreground">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Conseils de sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseils de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Activez la 2FA pour une sécurité maximale</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Révokez les sessions non utilisées</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Utilisez un mot de passe fort et unique</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Ne partagez jamais vos codes 2FA</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={fetchSecurityData}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser les sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 