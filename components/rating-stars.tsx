"use client";

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

interface RatingStarsProps {
  articleSlug: string;
  currentRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export function RatingStars({ 
  articleSlug, 
  currentRating = 0, 
  onRatingChange,
  readonly = false 
}: RatingStarsProps) {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { user } = useAuth();

  // Récupérer la note actuelle de l'utilisateur
  useEffect(() => {
    if (user) {
      fetchUserRating();
    }
  }, [user, articleSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/articles/${articleSlug}/ratings`);
      if (response.ok) {
        const ratings = await response.json();
        // Trouver la note de l'utilisateur actuel
        const userRatingData = ratings.find((r: any) => r.userId === user?.id); // eslint-disable-line @typescript-eslint/no-explicit-any
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setRating(userRatingData.rating);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la note:', error);
    }
  };

  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const handleStarClick = async (starRating: number) => {
    if (readonly || !user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleSlug}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: starRating }),
      });

      if (response.ok) {
        setRating(starRating);
        setUserRating(starRating);
        onRatingChange?.(starRating);
        
        // Afficher un message de succès
        if (userRating === 0) {
          alert(`Merci ! Vous avez donné ${starRating} étoile${starRating > 1 ? 's' : ''} à cet article.`);
        } else {
          alert(`Votre note a été mise à jour à ${starRating} étoile${starRating > 1 ? 's' : ''}.`);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la notation');
      }
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      alert('Erreur lors de la notation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (readonly) return;
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  if (!user && !readonly) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-5 w-5 text-gray-300"
              fill="currentColor"
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          Connectez-vous pour noter
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-0 h-auto w-auto"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            disabled={readonly || isSubmitting}
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                star <= displayRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </Button>
        ))}
      </div>
      {!readonly && (
        <span className="text-sm text-muted-foreground">
          {userRating > 0 ? `Votre note: ${userRating}/5` : 'Cliquez pour noter'}
        </span>
      )}
    </div>
  );
} 