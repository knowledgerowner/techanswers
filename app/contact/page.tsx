"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (success) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-semibold">Message envoyé avec succès !</h2>
          <p className="mt-2 text-muted-foreground">
            Merci pour votre message. L&apos;équipe TechAnswers vous répondra dans les plus brefs délais.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            className="mt-4"
          >
            Envoyer un autre message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Contactez TechAnswers
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Besoin d&apos;aide, de conseils ou d&apos;une collaboration ? Notre équipe d&apos;experts est là pour vous accompagner 
          dans vos projets technologiques et répondre à toutes vos questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 ">
        {/* Formulaire de contact */}
        <div className="space-y-6 col-span-1 lg:col-span-2 text-center lg:text-left">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nom complet *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Sujet *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={8}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet, votre question ou votre demande de collaboration..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center xl:text-left">Pourquoi choisir TechAnswers ?</h3>
              <div className="space-y-3 text-sm text-muted-foreground text-center xl:text-left">
                <p>✅ Expertise technique approfondie et mise à jour régulière</p>
                <p>✅ Réponse personnalisée et adaptée à vos besoins spécifiques</p>
                <p>✅ Accompagnement complet de la conception à la mise en production</p>
                <p>✅ Technologies modernes et bonnes pratiques de développement</p>
                <p>✅ Support continu et suivi de projet rigoureux</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Informations et Présentation */}
        <div className="space-y-8">
          {/* Présentation d&apos;Oxelya */}
          <Card className="border-2 border-primary/20 text-center lg:text-left">
            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  O
                </div>
                <div className="text-center lg:text-left w-full">
                  <h2 className="text-2xl font-bold text-center xl:text-left">Oxelya</h2>
                  <p className="text-muted-foreground text-center xl:text-left">Entreprise de Services Numériques</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Développement Web</Badge>
                    <Badge variant="outline">Cybersécurité</Badge>
                    <Badge variant="outline">SEO</Badge>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none text-center xl:text-left">
                <p className="mb-4">
                  Oxelya est une entreprise spécialisée dans les services numériques, créatrice de TechAnswers, 
                  une plateforme de référence dédiée au partage de connaissances techniques et à l&apos;accompagnement 
                  des développeurs et entreprises dans leurs projets technologiques.
                </p>
                
                <p className="mb-4">
                  Notre équipe d&apos;experts combine expertise technique et vision stratégique pour offrir 
                  des solutions complètes en développement web, cybersécurité, optimisation SEO et 
                  assistance informatique. Nous accompagnons nos clients de la conception à la mise en production.
                </p>

                <p className="mb-6">
                  TechAnswers représente notre engagement envers la communauté tech : partager des ressources 
                  éducatives de qualité, des tutoriels pratiques et des insights techniques pour aider 
                  les développeurs de tous niveaux à exceller dans leur domaine.
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Services principaux :</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Développement Web</li>
                      <li>• Pentest Cybersécurité</li>
                      <li>• Consultant SEO</li>
                      <li>• Assistance informatique</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Technologies maîtrisées :</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Python/Bash/Node.js</li>
                      <li>• React/Next.js/TypeScript</li>
                      <li>• Tests de pénétration</li>
                      <li>• Optimisation SEO</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Email professionnel</p>
                    <Link href="mailto:contact@oxelya.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      contact@oxelya.com
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400">🌐</span>
                  </div>
                  <div>
                    <p className="font-medium">Site web personnel</p>
                    <Link href="https://www.oxelya.com" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">
                      www.oxelya.com
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400">⚡</span>
                  </div>
                  <div>
                    <p className="font-medium">Temps de réponse</p>
                    <p className="text-muted-foreground">24-48 heures maximum</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services proposés */}
          
        </div>

        <Card className="col-span-1 lg:col-span-3">
            <CardContent className="p-6 w-full text-center">
              <h3 className="text-xl font-semibold mb-4">Services Oxelya</h3>
              <div className="space-y-3 block lg:flex justify-center gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Développement Web</p>
                    <p className="text-sm text-muted-foreground">Applications web modernes, sites e-commerce, APIs et systèmes complexes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Pentest Cybersécurité</p>
                    <p className="text-sm text-muted-foreground">Tests de pénétration, audits de sécurité et protection de vos systèmes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Consultant SEO</p>
                    <p className="text-sm text-muted-foreground">Optimisation pour les moteurs de recherche et amélioration de la visibilité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Programmation</p>
                    <p className="text-sm text-muted-foreground">Python, Bash, Node.js et développement d&apos;outils personnalisés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Assistance informatique</p>
                    <p className="text-sm text-muted-foreground">Support technique, maintenance et résolution de problèmes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

      </div>

      {/* Section SEO */}
      <div className="mt-16 prose prose-sm dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-6">TechAnswers - Votre partenaire technologique de confiance</h2>
        <p className="mb-4">
          TechAnswers est une plateforme de référence dans le domaine du développement web moderne et des technologies émergentes. 
          Notre mission est de fournir des ressources éducatives de qualité, des tutoriels pratiques et des insights techniques 
          pour aider les développeurs à exceller dans leur domaine.
        </p>
        <p className="mb-4">
          Que vous soyez un développeur débutant cherchant à maîtriser React et Next.js, un professionnel expérimenté 
          explorant les dernières avancées en intelligence artificielle, ou une entreprise souhaitant moderniser 
          son infrastructure technique, notre équipe d&apos;experts est là pour vous accompagner.
        </p>
        <p>
          Contactez-nous dès aujourd&apos;hui pour discuter de vos projets, obtenir des conseils d&apos;experts ou explorer 
          des opportunités de collaboration. Notre engagement est de vous fournir des solutions innovantes et 
          des résultats exceptionnels dans tous vos projets technologiques.
        </p>
      </div>
    </div>
  );
} 