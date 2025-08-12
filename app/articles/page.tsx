"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  imageUrl: string | null;
  isMarketing: boolean;
  categoryIds: string[];
  createdAt: Date;
  admin: {
    username: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: searchTerm,
        category: selectedCategory,
        sort: sortBy,
      });

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      
      setArticles(data.articles);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground mt-2">
          Découvrez nos derniers articles sur la technologie et le développement
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">Rechercher</Button>
        </form>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "date" | "title");
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="date">Trier par date</option>
            <option value="title">Trier par titre</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="h-full overflow-hidden rounded-xl border bg-card animate-pulse">
              <div className="aspect-[16/9] w-full bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group">
                <article className="h-full overflow-hidden rounded-xl border bg-card transition hover:shadow-md">
                  <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
                    {article.imageUrl ? (
                      <Image 
                        src={article.imageUrl} 
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Image src="/window.svg" alt="" width={60} height={60} className="opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>
                        {article.isMarketing ? "Marketing" : "Article"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        par {article.admin.username}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold leading-tight group-hover:underline">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {article.excerpt || "Aucun résumé disponible"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun article trouvé</p>
        </div>
      )}
    </div>
  );
} 