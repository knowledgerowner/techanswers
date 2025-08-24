'use client';

import { Button } from '@/components/ui/button';

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'abonnement
    console.log('Newsletter subscription');
  };

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        required
        placeholder="Votre email"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
      />
      <Button className="sm:w-auto">S&apos;abonner</Button>
    </form>
  );
} 