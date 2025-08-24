"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/useAuth';
import { MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user?: {
    username: string;
  };
  authorName?: string;
}

interface ArticleCommentsProps {
  articleSlug: string;
  comments: Comment[];
  onCommentAdded?: (comment: Comment) => void;
}

export function ArticleComments({ 
  articleSlug, 
  comments: initialComments, 
  onCommentAdded 
}: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    if (!newComment.trim()) {
      alert('Le commentaire ne peut pas être vide');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
        onCommentAdded?.(comment);
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Commentaires ({comments.length})</h2>
      </div>

      {/* Formulaire de commentaire */}
      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un commentaire</CardTitle>
            <CardDescription>
              Partagez votre avis sur cet article
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrivez votre commentaire ici..."
                rows={4}
                className="resize-none"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Envoi...' : 'Publier le commentaire'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Connectez-vous pour ajouter un commentaire
              </p>
              <Link href="/login">
                <Button>Se connecter</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des commentaires */}
      {comments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.user?.username || comment.authorName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comment.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 