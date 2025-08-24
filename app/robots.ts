import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techanswers.fr';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/articles/*',
          '/categories/*',
          '/about',
          '/contact',
          '/partners',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/profile/*',
          '/login',
          '/register',
          '/_next/*',
          '/favicon.ico',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/articles/*',
          '/categories/*',
          '/about',
          '/contact',
          '/partners',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/profile/*',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'CCBot',
        allow: [
          '/',
          '/articles/*',
          '/categories/*',
          '/about',
          '/contact',
          '/partners',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/profile/*',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/categories/sitemap.xml`,
      `${baseUrl}/articles/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
    ],
    host: baseUrl,
  };
} 