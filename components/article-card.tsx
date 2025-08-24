'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Clock, Eye, BookOpen } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string | null;
    slug: string;
    imageUrl: string | null;
    createdAt: string;
    user: {
      username: string;
    };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <Card className="h-[500px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 relative">
        {/* Image avec overlay et effets */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800">
          {article.imageUrl ? (
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Article technique</p>
              </div>
            </div>
          )}
          
          {/* Overlay avec gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badge Article Gratuit */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg backdrop-blur-sm font-medium">
              <BookOpen className="w-3 h-3 mr-1" />
              Gratuit
            </Badge>
          </div>

          {/* Icône de lecture */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm">
              <ArrowRight className="w-5 h-5 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Contenu de la carte */}
        <CardContent className="p-6 flex flex-col h-[236px]">
          {/* Métadonnées */}
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="font-medium">{article.user.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          
          {/* Titre */}
          <h3 className="text-xl font-bold leading-tight mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          
          {/* Extrait */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed text-sm flex-1">
            {article.excerpt || "Découvrez ce contenu technique gratuit et enrichissez vos connaissances."}
          </p>
          
          {/* Footer avec indicateurs */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Lecture rapide</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Accès libre</span>
              </div>
            </div>
            
            {/* Bouton de lecture */}
            <div className="opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Effet de bordure colorée */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20" />
        </div>

        {/* Accent décoratif */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </Card>
    </Link>
  );
} 