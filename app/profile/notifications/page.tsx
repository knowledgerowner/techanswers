'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Mail, 
  Settings, 
  Globe, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/contexts/NotificationContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategorySubscription {
  id: string;
  categoryId: string;
  category: Category;
  type: 'ALL_ARTICLES' | 'FEATURED_ONLY' | 'PREMIUM_ONLY' | 'CUSTOM';
  notifyOnPublish: boolean;
  notifyOnUpdate: boolean;
  notifyOnComment: boolean;
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'NEVER';
}

interface NotificationSettings {
  id: string;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  newArticles: boolean;
  commentReplies: boolean;
  securityAlerts: boolean;
  newsletter: boolean;
  marketing: boolean;
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'NEVER';
  quietHoursStart?: string;
  quietHoursEnd?: string;
  emailNotifications: {
    id: string;
    welcome: boolean;
    articlePublished: boolean;
    commentReply: boolean;
    securityAlert: boolean;
    newsletter: boolean;
    custom: boolean;
    htmlEmails: boolean;
    plainTextEmails: boolean;
    emailSignature?: string;
  };
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptions, setSubscriptions] = useState<CategorySubscription[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotificationData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotificationData = async () => {
    try {
      const [categoriesResponse, subscriptionsResponse, settingsResponse, notificationsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/profile/notifications/subscriptions'),
        fetch('/api/profile/notifications/settings'),
        fetch('/api/notifications')
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json();
        setSubscriptions(subscriptionsData);
      }

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        console.log('🔔 [NOTIFICATIONS] Paramètres chargés:', settingsData);
        setSettings(settingsData);
      } else {
        console.error('❌ [NOTIFICATIONS] Erreur chargement paramètres:', settingsResponse.status);
      }

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        console.log('🔔 [NOTIFICATIONS] Notifications chargées:', notificationsData.length);
        setNotifications(notificationsData);
      } else {
        console.error('❌ [NOTIFICATIONS] Erreur chargement notifications:', notificationsResponse.status);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les paramètres de notifications.',
      });
    } finally {
      setIsLoading(false);
      setNotificationsLoading(false);
    }
  };

  const handleSubscriptionToggle = async (categoryId: string, enabled: boolean) => {
    try {
      if (enabled) {
        // Créer un nouvel abonnement
        const response = await fetch('/api/profile/notifications/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId,
            type: 'ALL_ARTICLES',
            notifyOnPublish: true,
            notifyOnUpdate: false,
            notifyOnComment: false,
            frequency: 'IMMEDIATE'
          }),
        });

        if (response.ok) {
          const newSubscription = await response.json();
          setSubscriptions(prev => [...prev, newSubscription]);
          addNotification({
            type: 'success',
            title: 'Abonnement activé',
            message: 'Vous recevrez maintenant des notifications pour cette catégorie.',
          });
        }
      } else {
        // Supprimer l'abonnement
        const subscription = subscriptions.find(s => s.categoryId === categoryId);
        if (subscription) {
          const response = await fetch(`/api/profile/notifications/subscriptions/${subscription.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setSubscriptions(prev => prev.filter(s => s.id !== subscription.id));
            addNotification({
              type: 'success',
              title: 'Abonnement désactivé',
              message: 'Vous ne recevrez plus de notifications pour cette catégorie.',
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'abonnement:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier l\'abonnement.',
      });
    }
  }; 

  const handleSettingsChange = (field: keyof NotificationSettings, value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (settings) {
      setSettings(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleEmailSettingsChange = (field: string, value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (settings?.emailNotifications) {
      setSettings(prev => prev ? {
        ...prev,
        emailNotifications: {
          ...prev.emailNotifications,
          [field]: value
        }
      } : null);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Paramètres sauvegardés',
          message: 'Vos préférences de notifications ont été mises à jour.',
        });
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de sauvegarder les paramètres.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de marquer la notification comme lue.',
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        addNotification({
          type: 'success',
          title: 'Notification supprimée',
          message: 'La notification a été supprimée.',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer la notification.',
      });
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications([]);
        addNotification({
          type: 'success',
          title: 'Notifications supprimées',
          message: 'Toutes les notifications ont été supprimées.',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer les notifications.',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ARTICLE_PUBLISHED':
        return '📚';
      case 'COMMENT_REPLY':
        return '💬';
      case 'SECURITY_ALERT':
        return '🔒';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationPriority = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return { color: 'text-red-500', bg: 'bg-red-50', text: 'Haute' };
      case 'MEDIUM':
        return { color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Moyenne' };
      case 'LOW':
        return { color: 'text-blue-500', bg: 'bg-blue-50', text: 'Basse' };
      default:
        return { color: 'text-gray-500', bg: 'bg-gray-50', text: 'Normale' };
    }
  };

  const isSubscribed = (categoryId: string) => {
    return subscriptions.some(s => s.categoryId === categoryId);
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences de notifications et abonnements
          </p>
        </div>
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences de notifications et abonnements aux catégories
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abonnements aux catégories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Abonnements aux catégories
              </CardTitle>
              <CardDescription>
                Choisissez les catégories pour lesquelles vous souhaitez recevoir des notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {isSubscribed(category.id) ? 'Abonné' : 'Non abonné'}
                        </Badge>
                        {isSubscribed(category.id) && (
                          <Badge variant="outline" className="text-xs">
                            Notifications immédiates
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={isSubscribed(category.id)}
                      onCheckedChange={(enabled) => handleSubscriptionToggle(category.id, enabled)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paramètres généraux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications globales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!settings ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Chargement des paramètres...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Types de notifications */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Types de notifications</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="text-sm">Nouveaux articles</span>
                        </div>
                        <Switch
                          checked={settings.newArticles}
                          onCheckedChange={(value) => handleSettingsChange('newArticles', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Réponses aux commentaires</span>
                        </div>
                        <Switch
                          checked={settings.commentReplies}
                          onCheckedChange={(value) => handleSettingsChange('commentReplies', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Alertes de sécurité</span>
                        </div>
                        <Switch
                          checked={settings.securityAlerts}
                          onCheckedChange={(value) => handleSettingsChange('securityAlerts', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          <span className="text-sm">Newsletter</span>
                        </div>
                        <Switch
                          checked={settings.newsletter}
                          onCheckedChange={(value) => handleSettingsChange('newsletter', value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Méthodes de notification */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Méthodes de notification</h4>
                    <p className="text-sm text-muted-foreground">
                      Choisissez comment vous souhaitez recevoir vos notifications
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="text-sm">Notifications sur le site</span>
                        </div>
                        <Switch
                          checked={settings.inAppNotifications}
                          onCheckedChange={(value) => handleSettingsChange('inAppNotifications', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Notifications par email</span>
                        </div>
                        <Switch
                          checked={settings.emailNotifications?.articlePublished || false}
                          onCheckedChange={(value) => handleEmailSettingsChange('articlePublished', value)}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                      💡 <strong>Conseil :</strong> Vous pouvez activer les deux méthodes pour recevoir vos notifications à la fois sur le site et par email.
                    </div>
                  </div>

                  <Separator />

                  {/* Fréquence des notifications */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Fréquence des notifications</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Notifications push</span>
                        </div>
                        <Switch
                          checked={settings.pushNotifications}
                          onCheckedChange={(value) => handleSettingsChange('pushNotifications', value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Paramètres d'email détaillés */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Paramètres d&apos;email détaillés</h4>
                    <p className="text-sm text-muted-foreground">
                      Configurez quels types d&apos;emails vous souhaitez recevoir
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Articles publiés</span>
                        </div>
                        <Switch
                          checked={settings.emailNotifications?.articlePublished || false}
                          onCheckedChange={(value) => handleEmailSettingsChange('articlePublished', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Réponses commentaires</span>
                        </div>
                        <Switch
                          checked={settings.emailNotifications?.commentReply || false}
                          onCheckedChange={(value) => handleEmailSettingsChange('commentReply', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Alertes sécurité</span>
                        </div>
                        <Switch
                          checked={settings.emailNotifications?.securityAlert || false}
                          onCheckedChange={(value) => handleEmailSettingsChange('securityAlert', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Newsletter</span>
                        </div>
                        <Switch
                          checked={settings.emailNotifications?.newsletter || false}
                          onCheckedChange={(value) => handleEmailSettingsChange('newsletter', value)}
                        />
                      </div>
                    </div>
                  </div>

                                <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={fetchNotificationData} 
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser les paramètres
              </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Table des notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Mes notifications
                  </CardTitle>
                  <CardDescription>
                    Historique de vos notifications reçues
                  </CardDescription>
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllNotifications}
                    className="text-red-600 hover:text-red-700"
                  >
                    Effacer tout
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Chargement des notifications...</span>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune notification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vous n&apos;avez pas encore reçu de notifications.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.isRead 
                          ? 'bg-muted/50 border-muted' 
                          : 'bg-background border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium text-sm ${
                                notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getNotificationPriority(notification.priority).bg} ${getNotificationPriority(notification.priority).color}`}
                              >
                                {getNotificationPriority(notification.priority).text}
                              </Badge>
                            </div>
                            <p className={`text-sm ${
                              notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.message}
                            </p>
                            
                            {/* Lien vers l'article si c'est une notification d'article */}
                            {notification.type === 'ARTICLE_PUBLISHED' && notification.data?.articleUrl && (
                              <div className="mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(notification.data.articleUrl, '_blank')}
                                  className="h-7 text-xs"
                                >
                                  📖 Lire l&apos;article
                                </Button>
                              </div>
                            )}
                            
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.createdAt).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
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
          {/* Résumé des abonnements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Catégories abonnées</span>
                <span className="font-medium">{subscriptions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications sur le site</span>
                <span className="font-medium">
                  {settings ? (settings.inAppNotifications ? 'Activées' : 'Désactivées') : '...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications par email</span>
                <span className="font-medium">
                  {settings?.emailNotifications?.articlePublished ? 'Activées' : 'Désactivées'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications reçues</span>
                <span className="font-medium">{notifications.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Conseils */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Abonnez-vous aux catégories qui vous intéressent</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Configurez les heures silencieuses si nécessaire</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Choisissez la fréquence qui vous convient</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Désactivez les notifications marketing si non désirées</span>
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
                onClick={fetchNotificationData} 
                className="w-full justify-start"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser les abonnements
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'SYSTEM',
                        title: 'Notification de test',
                        message: 'Ceci est une notification de test pour vérifier le système !',
                        priority: 'NORMAL'
                      })
                    });
                    
                    if (response.ok) {
                      const newNotification = await response.json();
                      setNotifications(prev => [newNotification, ...prev]);
                      addNotification({
                        type: 'success',
                        title: 'Test réussi',
                        message: 'Notification de test créée avec succès !'
                      });
                    }
                  } catch (error) {
                    console.error('Erreur lors de la création de la notification de test:', error);
                    addNotification({
                      type: 'error',
                      title: 'Erreur',
                      message: 'Impossible de créer la notification de test.'
                    });
                  }
                }} 
                className="w-full justify-start"
              >
                <Bell className="mr-2 h-4 w-4" />
                Tester les notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 