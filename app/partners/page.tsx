"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Partenariats TechAnswers
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Découvrez nos opportunités de partenariat et nos services de collaboration 
          pour développer votre présence digitale et votre visibilité en ligne.
        </p>
      </div>

      {/* Nos Services de Partenariat */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Services de Partenariat</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 border-blue-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Rédaction d&apos;Articles Gratuits</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Rédigez du contenu de qualité pour notre blog et recevez des revenus.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Articles techniques approfondis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Optimisation SEO intégrée (Viser les mots clés)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Rémnuération au nombre d&apos;articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Rémunération selon traffic généré</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Backlinks DoFollow</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Backlinks de qualité sur TechAnswers exclusivement.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Article avec une ancre sur TechAnswers : 30€ (500 mots) </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Article avec une ancre : 40€ (800 mots)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Article avec une ancre : 50€ (1400 mots)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Article en première page : +15€</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Multi Article ou Multi Ancres : <Link href="/contact" className="text-blue-500 hover:text-blue-600">Sur Demande</Link></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Emplacement Publicitaire</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Mise en avant de vos produits/services dans des pages ciblées de TechAnswers.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Mention naturelle de votre marque</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Liens contextuels intégrés</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Bannière publicitaire en sidebar : Prix selon taille de l&apos;annonce</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-500/20 hover:shadow-lg transition-shadow col-span-3">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Réseau PBN</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Accès à notre réseau de blogs partenaires pour une visibilité maximale.
              </p>
              <div className="space-y-2 text-sm flex justify-center gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Réseau de 50+ blogs partenaires</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Thématiques variées et qualifiées</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Backlinks de qualité garantis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Gestion complète des placements</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pourquoi les Backlinks sont Importants */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi les Backlinks sont Cruciaux pour votre SEO ?</h2>
        
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Les backlinks sont considérés comme des <strong>&quot;votes de confiance&quot;</strong> par Google et constituent l&apos;un des facteurs de classement les plus importants pour votre référencement. Dans l&apos;écosystème SEO moderne, ils jouent un rôle central dans la détermination de l&apos;autorité et de la crédibilité de votre site web.
              </p>

              <h3 className="text-xl font-bold mb-4 text-blue-600">🎯 Autorité et Crédibilité</h3>
              <p className="mb-4">
                Chaque backlink de qualité que votre site reçoit est perçu par Google comme un signal de confiance. Plus votre site accumule de backlinks provenant de sites fiables et pertinents, plus il gagne en autorité dans son domaine. Cette autorité se traduit directement par une amélioration de votre <strong>Domain Authority (DA)</strong> et un positionnement plus élevé dans les pages de résultats de recherche (SERP).
              </p>

              <h3 className="text-xl font-bold mb-4 text-green-600">📈 Trafic Organique et Visibilité</h3>
              <p className="mb-4">
                Au-delà de l&apos;impact SEO pur, les backlinks génèrent un <strong>trafic organique ciblé</strong> vers votre site. Chaque lien placé sur un site pertinent peut amener des visiteurs qualifiés qui sont naturellement intéressés par vos produits ou services. Ce trafic de référence présente généralement un taux de conversion plus élevé que le trafic direct, car les visiteurs arrivent déjà avec un contexte et une intention d&apos;achat.
              </p>

              <h3 className="text-xl font-bold mb-4 text-purple-600">⚡ Indexation et Découverte</h3>
              <p className="mb-4">
                Les backlinks servent également de <strong>&quot;routes&quot; pour les crawlers</strong> de Google, facilitant la découverte et l&apos;indexation de vos nouvelles pages. Ils aident les moteurs de recherche à comprendre le contexte et la pertinence de votre contenu, améliorant ainsi la compréhension de vos mots-clés ciblés et de votre thématique globale.
              </p>

              <h3 className="text-xl font-bold mb-4 text-orange-600">🏆 Avantage Concurrentiel</h3>
              <p className="mb-6">
                Dans un environnement digital ultra-concurrentiel, les backlinks de qualité vous donnent un <strong>avantage décisif</strong> sur vos concurrents. Ils constituent un investissement à long terme qui génère des résultats durables et pérennes, offrant un ROI élevé sur le long terme. Contrairement à d&apos;autres stratégies marketing qui peuvent perdre leur efficacité, les backlinks de qualité continuent de produire des bénéfices SEO pendant des années.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold mb-2">💡 Pourquoi Choisir TechAnswers pour vos Backlinks ?</h4>
                <p className="mb-3">
                  TechAnswers se distingue par son <strong>Domain Authority de 85+</strong>, ce qui signifie que nos backlinks ont un impact maximal sur votre SEO. Notre audience de développeurs et professionnels tech génère un trafic hautement qualifié, et tous nos backlinks sont <strong>DoFollow</strong>, transmettant pleinement le &quot;jus de lien&quot;.
                </p>
                <p>
                  Nous offrons également des <strong>rapports détaillés</strong> pour suivre l&apos;impact de vos backlinks, des délais de livraison optimisés (3-5 jours), et une garantie de qualité sur chaque placement. Chaque backlink est vérifié et validé pour garantir sa pertinence et son impact positif sur votre référencement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Avantages de Partenariat */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir TechAnswers ?</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="h-82">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  Statistiques Impressionnantes
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">50K+</div>
                    <div className="text-sm text-muted-foreground">Visiteurs/mois</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">85+</div>
                    <div className="text-sm text-muted-foreground">Domain Authority</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">200+</div>
                    <div className="text-sm text-muted-foreground">Articles publiés</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">15K+</div>
                    <div className="text-sm text-muted-foreground">Abonnés newsletter</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-82">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  Audience Qualifiée
                </h3>
                <p className="text-muted-foreground mb-4">
                  Notre audience est composée de développeurs, architectes logiciels, 
                  CTOs et décideurs techniques. Un public hautement qualifié pour vos 
                  produits et services technologiques.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>75% de développeurs professionnels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>60% de décideurs techniques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Pouvoir d&apos;achat élevé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-82">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  Réseau PBN Puissant
                </h3>
                <p className="text-muted-foreground mb-4">
                  Accédez à notre réseau de plus de 50 blogs partenaires couvrant 
                  diverses thématiques technologiques et business.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>50+ blogs partenaires</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Domain Authority 40-85</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Trafic organique qualifié</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Backlinks naturels et durables</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-82">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  Expertise Technique
                </h3>
                <p className="text-muted-foreground mb-4">
                  Notre équipe d&apos;experts techniques garantit des articles de qualité 
                  avec des informations précises et à jour.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>8+ ans d&apos;expérience technique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Expertise en cybersécurité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Certifications professionnelles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Veille technologique constante</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Processus de Collaboration */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Notre Processus de Collaboration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Consultation</h3>
            <p className="text-sm text-muted-foreground">
              Analyse de vos besoins et définition de la stratégie de partenariat
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Proposition</h3>
            <p className="text-sm text-muted-foreground">
              Élaboration d&apos;une proposition personnalisée avec planning et tarifs
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Exécution</h3>
            <p className="text-sm text-muted-foreground">
              Création du contenu et mise en place des backlinks selon le planning
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Suivi</h3>
            <p className="text-sm text-muted-foreground">
              Monitoring des performances et optimisation continue
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à devenir un partenaire TechAnswers ?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins en partenariat 
              et découvrir comment TechAnswers peut booster votre visibilité en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  C&apos;est parti
                </Button>
              </Link>
              <Link href="tel:+33643323412">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Nous appeler
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section SEO */}
      <section className="prose prose-lg dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-6">Partenariats TechAnswers - Votre Partenaire SEO de Confiance</h2>
        <p className="mb-4">
          TechAnswers propose des services de partenariat premium pour les entreprises et professionnels 
          souhaitant améliorer leur visibilité en ligne et leur autorité dans le domaine technologique. 
          Notre expertise en rédaction technique, notre réseau de backlinks de qualité et notre audience 
          hautement qualifiée font de nous le partenaire idéal pour vos objectifs de marketing digital.
        </p>
        <p className="mb-4">
          Que vous soyez une startup tech cherchant à établir sa crédibilité, une agence de développement 
          souhaitant attirer de nouveaux clients, ou une entreprise établie désireuse de renforcer sa 
          présence en ligne, nos services de partenariat s&apos;adaptent à vos besoins spécifiques. 
          Notre approche personnalisée garantit des résultats mesurables et un retour sur investissement optimal.
        </p>
        <p>
          Rejoignez notre réseau de partenaires satisfaits et bénéficiez de notre expertise technique, 
          de notre audience qualifiée et de notre réseau PBN puissant pour atteindre vos objectifs 
          de visibilité et de croissance en ligne.
        </p>
      </section>
    </div>
  );
} 