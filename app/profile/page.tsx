'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Crown, 
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showEmail, setShowEmail] = useState(false);

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadge = () => {
    if (user.isSuperAdmin) {
      return <Badge className="bg-red-600 hover:bg-red-700">Super Admin</Badge>;
    }
    if (user.isAdmin) {
      return <Badge className="bg-orange-600 hover:bg-orange-700">Admin</Badge>;
    }
    return <Badge variant="outline">Utilisateur</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte d'identité */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">Informations personnelles</CardTitle>
                <CardDescription>
                  Vos informations de base et votre statut
                </CardDescription>
              </div>
              <Link href="/profile/settings">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-semibold">{user.username}</h3>
                    {getRoleBadge()}
                  </div>
                  <p className="text-muted-foreground">
                    Membre depuis {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {showEmail ? user.email : '••••••••@••••••••'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEmail(!showEmail)}
                      >
                        {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date d&apos;inscription</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Statut du compte</p>
                    <p className="text-sm text-muted-foreground">
                      Actif
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Rôle</p>
                    <p className="text-sm text-muted-foreground">
                      {user.isSuperAdmin ? 'Super Administrateur' : 
                       user.isAdmin ? 'Administrateur' : 'Utilisateur'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>
                Votre activité sur TechAnswers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <p className="text-sm text-muted-foreground">Articles lus</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <p className="text-sm text-muted-foreground">Commentaires</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <p className="text-sm text-muted-foreground">Articles achetés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/profile/settings" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Modifier le profil
                </Button>
              </Link>
              <Link href="/profile/security" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Sécurité
                </Button>
              </Link>
              <Link href="/profile/notifications" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Informations de sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentification 2FA</span>
                <Badge variant={user.twoFactorEnabled ? "default" : "outline"}>
                  {user.twoFactorEnabled ? "Activée" : "Non activée"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email vérifié</span>
                <Badge variant={user.isEmailVerified ? "default" : "outline"}>
                  {user.isEmailVerified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dernière connexion</span>
                <span className="text-xs text-muted-foreground">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais'}
                </span>
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
                  <Mail className="mr-2 h-4 w-4" />
                  Contacter le support
                </Button>
              </Link>
              <Link href="/about" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  À propos de TechAnswers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 