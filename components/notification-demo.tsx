'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications } from '@/lib/contexts/NotificationContext';

export default function NotificationDemo() {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    template: 'welcome' as 'welcome' | 'article-published' | 'comment-reply' | 'security-alert',
    username: '',
    activationLink: '',
    title: '',
    message: '',
    articleUrl: '',
    articleTitle: '',
    commentUrl: '',
    details: '',
    timestamp: '',
    securityUrl: '',
    summary: '',
    htmlContent: '',
    actionUrl: '',
    actionText: '',
  });

  const { 
    addNotification, 
    sendEmailNotification, 
    state,
    clearAllNotifications,
    markAllAsRead 
  } = useNotifications();

  const handleAddNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    addNotification({
      type,
      title: `Notification ${type}`,
      message: `Ceci est un exemple de notification de type ${type}. Elle peut contenir des informations importantes pour l'utilisateur.`,
      duration: 5000,
      action: {
        label: 'Voir plus',
        onClick: () => console.log('Action cliquée !'),
      },
    });
  };

  const handleSendEmail = async () => {
    const emailNotification = {
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template,
      data: {
        username: emailData.username,
        activationLink: emailData.activationLink,
        title: emailData.title,
        message: emailData.message,
        articleUrl: emailData.articleUrl,
        articleTitle: emailData.articleTitle,
        commentUrl: emailData.commentUrl,
        details: emailData.details,
        timestamp: emailData.timestamp,
        securityUrl: emailData.securityUrl,
        summary: emailData.summary,
        htmlContent: emailData.htmlContent,
        actionUrl: emailData.actionUrl,
        actionText: emailData.actionText,
      },
    };

    await sendEmailNotification(emailNotification);
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔔 Démonstration du Système de Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleAddNotification('success')} className="bg-green-600 hover:bg-green-700">
              ✅ Notification Succès
            </Button>
            <Button onClick={() => handleAddNotification('error')} className="bg-red-600 hover:bg-red-700">
              ❌ Notification Erreur
            </Button>
            <Button onClick={() => handleAddNotification('warning')} className="bg-yellow-600 hover:bg-yellow-700">
              ⚠️ Notification Avertissement
            </Button>
            <Button onClick={() => handleAddNotification('info')} className="bg-blue-600 hover:bg-blue-700">
              ℹ️ Notification Info
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={markAllAsRead} variant="outline">
              📖 Tout marquer comme lu
            </Button>
            <Button onClick={clearAllNotifications} variant="outline" className="text-red-600">
              🗑️ Effacer toutes les notifications
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Notifications actives :</strong> {state.notifications.length}</p>
            <p><strong>Non lues :</strong> {state.unreadCount}</p>
            <p><strong>Emails en attente :</strong> {state.emailNotifications.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📧 Envoyer une Notification par Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="to">Destinataire</Label>
              <Input
                id="to"
                type="email"
                placeholder="email@exemple.com"
                value={emailData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="Sujet de l'email"
                value={emailData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="template">Template</Label>
            <Select value={emailData.template} onValueChange={(value: any) => handleInputChange('template', value)}> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Bienvenue</SelectItem>
                <SelectItem value="article-published">Article publié</SelectItem>
                <SelectItem value="comment-reply">Réponse commentaire</SelectItem>
                <SelectItem value="security-alert">Alerte sécurité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Champs spécifiques selon le template */}
          {emailData.template === 'welcome' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                <Input
                  id="username"
                  placeholder="Nom de l'utilisateur"
                  value={emailData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="activationLink">Lien d&apos;activation</Label>
                <Input
                  id="activationLink"
                  placeholder="https://... (optionnel)"
                  value={emailData.activationLink}
                  onChange={(e) => handleInputChange('activationLink', e.target.value)}
                />
              </div>
            </div>
          )}

          {emailData.template === 'article-published' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                <Input
                  id="username"
                  placeholder="Nom de l'utilisateur"
                  value={emailData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="articleTitle">Titre de l&apos;article</Label>
                <Input
                  id="articleTitle"
                  placeholder="Titre de l'article"
                  value={emailData.articleTitle}
                  onChange={(e) => handleInputChange('articleTitle', e.target.value)}
                />
              </div>
            </div>
          )}

          {emailData.template === 'comment-reply' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                <Input
                  id="username"
                  placeholder="Nom de l'utilisateur"
                  value={emailData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="articleTitle">Titre de l&apos;article</Label>
                <Input
                  id="articleTitle"
                  placeholder="Titre de l'article"
                  value={emailData.articleTitle}
                  onChange={(e) => handleInputChange('articleTitle', e.target.value)}
                />
              </div>
            </div>
          )}

          {emailData.template === 'security-alert' && (
            <div className="grid grid-cols-2 gap-4">
                              <div>
                  <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                  <Input
                    id="username"
                    placeholder="Nom de l'utilisateur"
                    value={emailData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>
              <div>
                <Label htmlFor="message">Message d&apos;alerte</Label>
                <Input
                  id="message"
                  placeholder="Message de l'alerte de sécurité"
                  value={emailData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                />
              </div>
            </div>
          )}

          <Button onClick={handleSendEmail} className="w-full">
            📤 Envoyer l&apos;Email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 État du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Notifications en mémoire :</span>
              <span className="font-mono">{state.notifications.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Notifications non lues :</span>
              <span className="font-mono">{state.unreadCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Emails en attente :</span>
              <span className="font-mono">{state.emailNotifications.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Dernière notification :</span>
              <span className="font-mono">
                {state.notifications[0]?.timestamp 
                  ? new Date(state.notifications[0].timestamp).toLocaleTimeString('fr-FR')
                  : 'Aucune'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 