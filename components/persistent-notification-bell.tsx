'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PersistentNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export default function PersistentNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<PersistentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('🔔 [PERSISTENT-BELL] Chargement des notifications...');
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        console.log('🔔 [PERSISTENT-BELL] Notifications reçues:', data.length);
        setNotifications(data);
        const unread = data.filter((n: PersistentNotification) => !n.isRead).length;
        setUnreadCount(unread);
        console.log('🔔 [PERSISTENT-BELL] Notifications non lues:', unread);
      } else {
        console.error('🔔 [PERSISTENT-BELL] Erreur HTTP:', response.status);
      }
    } catch (error) {
      console.error('🔔 [PERSISTENT-BELL] Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erreur lors du marquage de tout comme lu:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de tout:', error);
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

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  return (
    <div className="relative">
      {/* Bouton de notification avec badge */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!isOpen) {
            // Rafraîchir les notifications quand on ouvre le panneau
            fetchNotifications();
          }
          setIsOpen(!isOpen);
        }}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white border-none"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panneau de notifications */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 z-50 max-h-[80vh] overflow-hidden">
          <Card className="shadow-2xl border-2 max-h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchNotifications}
                    className="text-xs"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs"
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Effacer tout
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                  <p>Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 max-h-[calc(80vh-120px)]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 transition-colors ${
                        notification.isRead ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5 text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-medium ${
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
                            
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                                >
                                  <Check className="w-3 h-3 text-green-600" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className={`text-sm ${
                            notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {notification.message}
                          </p>
                          
                          {/* Lien vers l'article si c'est une notification d'article */}
                          {notification.type === 'ARTICLE_PUBLISHED' && notification.data?.articleUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(notification.data.articleUrl, '_blank')}
                              className="mt-2 text-xs"
                            >
                              📖 Lire l&apos;article
                            </Button>
                          )}
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimestamp(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 