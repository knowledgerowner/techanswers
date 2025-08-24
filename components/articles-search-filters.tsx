'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticlesSearchFiltersProps {
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
}

export default function ArticlesSearchFilters({ 
  categories, 
  initialSearch = '', 
  initialCategory = '', 
  initialSort = 'date' 
}: ArticlesSearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL();
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL();
  };

  const updateURL = () => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    
    if (sortBy) {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    
    // Reset to first page when filters change
    params.delete('page');
    
    router.push(`/articles?${params.toString()}`);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recherche et filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Rechercher</Button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtres :</span>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("")}
            >
              Toutes
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <Button
              variant={sortBy === "date" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("date")}
            >
              Plus récent
            </Button>
            <Button
              variant={sortBy === "title" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("title")}
            >
              Alphabétique
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 