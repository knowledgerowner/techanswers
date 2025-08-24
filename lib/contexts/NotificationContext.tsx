'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types des notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  read: boolean;
  userId?: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  template: 'welcome' | 'article-published' | 'comment-reply' | 'security-alert' | 'newsletter' | 'custom';
  data: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// État du contexte
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  emailNotifications: EmailNotification[];
}

// Actions du reducer
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'ADD_EMAIL_NOTIFICATION'; payload: EmailNotification }
  | { type: 'CLEAR_EMAIL_NOTIFICATIONS' };

// Reducer pour gérer l'état
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0,
      };

    case 'REMOVE_NOTIFICATION':
      const notificationToRemove = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notificationToRemove?.read ? state.unreadCount : Math.max(0, state.unreadCount - 1),
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };

    case 'ADD_EMAIL_NOTIFICATION':
      return {
        ...state,
        emailNotifications: [...state.emailNotifications, action.payload],
      };

    case 'CLEAR_EMAIL_NOTIFICATIONS':
      return {
        ...state,
        emailNotifications: [],
      };

    default:
      return state;
  }
}

// Interface du contexte
interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  sendEmailNotification: (email: EmailNotification) => Promise<void>;
  clearEmailNotifications: () => void;
}

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Provider du contexte
interface NotificationProviderProps {
  children: ReactNode;
  userId?: string;
}

export function NotificationProvider({ children, userId }: NotificationProviderProps) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
    emailNotifications: [],
  });

  // Fonction pour ajouter une notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Ajouter au contexte local immédiatement
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Sauvegarder en base de données si userId est disponible
    if (userId) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: notification.type.toUpperCase(),
            title: notification.title,
            message: notification.message,
          }),
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la notification:', error);
      }
    }
    
    // Afficher le toast correspondant
    const toastOptions: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      duration: notification.duration || 5000,
    };

    if (notification.action) {
      toastOptions.action = {
        label: notification.action.label,
        onClick: notification.action.onClick,
      };
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, toastOptions);
        break;
      case 'error':
        toast.error(notification.title, toastOptions);
        break;
      case 'warning':
        toast.warning(notification.title, toastOptions);
        break;
      case 'info':
        toast.info(notification.title, toastOptions);
        break;
    }
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch({ type: 'MARK_AS_READ', payload: id });
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch({ type: 'MARK_ALL_AS_READ' });
      }
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  // Fonction pour supprimer une notification
  const removeNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  // Fonction pour effacer toutes les notifications
  const clearAllNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
    }
  };

  // Fonction pour envoyer une notification par email
  const sendEmailNotification = async (email: EmailNotification) => {
    try {
      // Ajouter à la liste des notifications email
      dispatch({ type: 'ADD_EMAIL_NOTIFICATION', payload: email });

      // Envoyer l'email via l'API
      const response = await fetch('/api/notifications/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Email envoyé',
        message: `L'email a été envoyé à ${email.to}`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      
      // Notification d'erreur
      addNotification({
        type: 'error',
        title: 'Erreur d\'envoi',
        message: 'Impossible d\'envoyer l\'email. Veuillez réessayer.',
      });
    }
  };

  // Fonction pour effacer les notifications email
  const clearEmailNotifications = () => {
    dispatch({ type: 'CLEAR_EMAIL_NOTIFICATIONS' });
  };

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    if (state.notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    }
  }, [state.notifications]);

  // Charger les notifications depuis la base de données
  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch('/api/notifications', {
          credentials: 'include',
        });

        if (response.ok) {
          const dbNotifications = await response.json();
          
          // Convertir les notifications de la DB au format du contexte
          dbNotifications.forEach((dbNotif: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            dispatch({ 
              type: 'ADD_NOTIFICATION', 
              payload: {
                type: dbNotif.type.toLowerCase(),
                title: dbNotif.title,
                message: dbNotif.message,
                userId: dbNotif.userId,
              }
            });
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    };

    loadNotifications();
  }, [userId]);

  const value: NotificationContextType = {
    state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    sendEmailNotification,
    clearEmailNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
} 