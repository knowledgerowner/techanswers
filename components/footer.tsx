"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/Logo.png" alt="TechAnswers" width={64} height={64} className="rounded-lg bg-transparent overflow-hidden"/>
            <span className="font-semibold tracking-tight">TechAnswers</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-prose">
            Le blog tech moderne: actualités, analyses et tutoriels.
          </p>
          <p className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} TechAnswers. Tous droits réservés.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Liens</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/articles" className="hover:text-foreground">Articles</Link></li>
            <li><Link href="/categories" className="hover:text-foreground">Catégories</Link></li>
            <li><Link href="/about" className="hover:text-foreground">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Newsletter</h4>
          <p className="text-sm text-muted-foreground mt-2">Recevez les nouveaux articles chaque semaine.</p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input type="email" placeholder="Votre email" required className="flex-1" />
            <Button type="submit">S&apos;abonner</Button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-7xl h-[1px] bg-gray-800"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
        <Link href="https://www.oxelya.com" className="hover:text-foreground">Made By Oxelya</Link>
      </div>
    </footer>
  );
} 
