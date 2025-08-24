'use client';

import { useState } from 'react';
import { Bell, X, Check, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications, Notification } from '@/lib/contexts/NotificationContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications();

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
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
        onClick={toggleNotifications}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {state.unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white border-none"
          >
            {state.unreadCount > 99 ? '99+' : state.unreadCount}
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
                  {state.unreadCount > 0 && (
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
              {state.notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 max-h-[calc(80vh-120px)]">
                  {state.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 transition-colors ${
                        notification.read ? 'opacity-60' : ''
                      } ${getNotificationColor(notification.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${
                              notification.read ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            
                            <div className="flex items-center gap-1">
                              {!notification.read && (
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
                                onClick={() => handleRemoveNotification(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={notification.action.onClick}
                              className="mt-2 text-xs"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimestamp(notification.timestamp)}
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

      {/* Overlay pour fermer le panneau */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 