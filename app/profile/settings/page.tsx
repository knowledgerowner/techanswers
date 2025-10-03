'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Building, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/contexts/NotificationContext';

interface UserSettings {
  firstName: string;
  lastName: string;
  bio: string;
  website: string;
  location: string;
  company: string;
  jobTitle: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    bio: '',
    website: '',
    location: '',
    company: '',
    jobTitle: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });



  useEffect(() => {
    if (user) {
      setSettings({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };



  const handleSaveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Paramètres sauvegardés',
          message: 'Vos informations ont été mises à jour avec succès.',
        });
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de sauvegarder les paramètres. Veuillez réessayer.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Les mots de passe ne correspondent pas.',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Mot de passe modifié',
          message: 'Votre mot de passe a été modifié avec succès.',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Impossible de modifier le mot de passe.',
      });
    } finally {
      setIsLoading(false);
    }
  };



  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar et informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Modifiez vos informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Informations de base */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Parlez-nous un peu de vous..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Informations professionnelles */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jobTitle">Poste</Label>
                  <Input
                    id="jobTitle"
                    value={settings.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="Votre poste actuel"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://votre-site.com"
                    type="url"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </Button>
            </CardContent>
          </Card>

          {/* Changement de mot de passe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Modifiez votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Votre mot de passe actuel"
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Le mot de passe doit contenir au moins 8 caractères
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="w-full"
              >
                {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Statut du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut du compte</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email vérifié</span>
                <Badge variant={user.isEmailVerified ? "default" : "outline"}>
                  {user.isEmailVerified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA activée</span>
                <Badge variant={user.twoFactorEnabled ? "default" : "outline"}>
                  {user.twoFactorEnabled ? "Activée" : "Non activée"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dernière connexion</span>
                <span className="text-xs text-muted-foreground">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
              <Link href="/profile/security" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Activer la 2FA
              </Link>
              </Button>
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
                <span>Utilisez un mot de passe fort et unique</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Activez l&apos;authentification à deux facteurs</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Vérifiez votre adresse email</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Ne partagez jamais vos identifiants</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 