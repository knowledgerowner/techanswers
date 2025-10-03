import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
          <Badge variant="outline" className="text-xs">RGPD</Badge>
        </div>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
        <p className="mt-4">
          Cette politique de confidentialité décrit comment Oxelya collecte, utilise et protège 
          vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
        </p>
      </div>

      <Separator className="my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p><strong>Oxelya</strong></p>
          <p>32 Rue de Cantelaude, 33380 Marcheprime, France</p>
          <p><strong>Email :</strong> contact@oxelya.com</p>
          <p><strong>Téléphone :</strong> +33 6 43 32 34 12</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
        
        <h3 className="text-xl font-semibold mb-3">2.1 Données d&apos;inscription</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Nom d&apos;utilisateur</li>
          <li>Adresse email</li>
          <li>Mot de passe (chiffré)</li>
          <li>Date d&apos;inscription</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.2 Données de profil (optionnelles)</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Prénom et nom</li>
          <li>Biographie</li>
          <li>Site web</li>
          <li>Localisation</li>
          <li>Entreprise et poste</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.3 Données d&apos;utilisation</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Commentaires et évaluations</li>
          <li>Articles consultés</li>
          <li>Préférences de notifications</li>
          <li>Historique de navigation</li>
          <li>Adresse IP et données de connexion</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.4 Données de paiement (traitées par Stripe)</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Informations de facturation</li>
          <li>Historique des achats</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Finalités du traitement</h2>
        <div className="space-y-4">
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">🔐 Gestion des comptes utilisateurs</h4>
            <p className="text-sm">Création, authentification et gestion de votre compte</p>
            <p className="text-xs text-muted-foreground mt-1"><strong>Base légale :</strong> Exécution du contrat</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">📧 Communication et notifications</h4>
            <p className="text-sm">Envoi d&apos;emails de service et notifications selon vos préférences</p>
            <p className="text-xs text-muted-foreground mt-1"><strong>Base légale :</strong> Consentement / Intérêt légitime</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">💳 Traitement des paiements</h4>
            <p className="text-sm">Gestion des achats d&apos;articles premium et facturation</p>
            <p className="text-xs text-muted-foreground mt-1"><strong>Base légale :</strong> Exécution du contrat</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">📊 Amélioration du service</h4>
            <p className="text-sm">Analyses statistiques pour améliorer nos services</p>
            <p className="text-xs text-muted-foreground mt-1"><strong>Base légale :</strong> Intérêt légitime</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">🛡️ Sécurité et conformité</h4>
            <p className="text-sm">Prévention de la fraude et respect des obligations légales</p>
            <p className="text-xs text-muted-foreground mt-1"><strong>Base légale :</strong> Obligation légale / Intérêt légitime</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
        <p className="mb-4">Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement avec :</p>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
            <div>
              <p><strong>Stripe</strong> - Pour le traitement des paiements</p>
              <p className="text-sm text-muted-foreground">Données : informations de facturation et paiement</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
            <div>
              <p><strong>Vercel</strong> - Pour l&apos;hébergement du site</p>
              <p className="text-sm text-muted-foreground">Données : logs de connexion et métadonnées techniques</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
            <div>
              <p><strong>Autorités compétentes</strong> - En cas d&apos;obligation légale</p>
              <p className="text-sm text-muted-foreground">Uniquement sur demande judiciaire ou administrative</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border border-muted rounded p-3">
            <span>Données de compte actif</span>
            <Badge variant="outline">Jusqu&apos;à suppression</Badge>
          </div>
          <div className="flex justify-between items-center border border-muted rounded p-3">
            <span>Données de compte supprimé</span>
            <Badge variant="outline">30 jours</Badge>
          </div>
          <div className="flex justify-between items-center border border-muted rounded p-3">
            <span>Données de facturation</span>
            <Badge variant="outline">10 ans</Badge>
          </div>
          <div className="flex justify-between items-center border border-muted rounded p-3">
            <span>Logs de connexion</span>
            <Badge variant="outline">12 mois</Badge>
          </div>
          <div className="flex justify-between items-center border border-muted rounded p-3">
            <span>Données analytiques</span>
            <Badge variant="outline">24 mois</Badge>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Vos droits (RGPD)</h2>
        <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">🔍 Droit d&apos;accès</h4>
            <p className="text-sm">Obtenir une copie de vos données personnelles</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">✏️ Droit de rectification</h4>
            <p className="text-sm">Corriger vos données inexactes ou incomplètes</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">🗑️ Droit d&apos;effacement</h4>
            <p className="text-sm">Demander la suppression de vos données</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">⏸️ Droit de limitation</h4>
            <p className="text-sm">Limiter le traitement de vos données</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">📦 Droit de portabilité</h4>
            <p className="text-sm">Récupérer vos données dans un format lisible</p>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">❌ Droit d&apos;opposition</h4>
            <p className="text-sm">Vous opposer au traitement de vos données</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm">
            <strong>Pour exercer vos droits :</strong> Contactez-nous à 
            <a href="mailto:dpo@techanswers.fr" className="text-blue-600 hover:underline ml-1">dpo@techanswers.fr</a>
          </p>
          <p className="text-sm mt-2">
            Nous répondrons à votre demande dans un délai maximum de 30 jours.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Sécurité des données</h2>
        <p className="mb-4">Nous mettons en place des mesures techniques et organisationnelles appropriées :</p>
        
        <ul className="list-disc list-inside space-y-2">
          <li>Chiffrement des mots de passe avec bcrypt</li>
          <li>Transmission sécurisée via HTTPS</li>
          <li>Authentification à deux facteurs (2FA)</li>
          <li>Surveillance et détection des tentatives d&apos;intrusion</li>
          <li>Sauvegardes régulières et chiffrées</li>
          <li>Formation du personnel à la protection des données</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Cookies et technologies similaires</h2>
        <p className="mb-4">Nous utilisons des cookies et technologies similaires pour :</p>
        
        <div className="space-y-3">
          <div className="border border-muted rounded p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cookies essentiels</span>
              <Badge variant="outline">Obligatoires</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Session utilisateur, authentification, panier
            </p>
          </div>
          
          <div className="border border-muted rounded p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cookies de préférences</span>
              <Badge variant="outline">Optionnels</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Langue, thème, préférences de notification
            </p>
          </div>
          
          <div className="border border-muted rounded p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cookies analytiques</span>
              <Badge variant="outline">Avec consentement</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Statistiques d&apos;utilisation, performances du site
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Transferts internationaux</h2>
        <p>
        Certaines de nos données peuvent être transférées vers des pays tiers 
          (notamment les États-Unis pour Stripe et Vercel). Ces transferts sont 
          encadrés par des garanties appropriées conformes au RGPD.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact et réclamations</h2>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p><strong>Délégué à la Protection des Données (DPO)</strong></p>
            <p>Email : <a href="mailto:contact@oxelya.com" className="text-blue-600 hover:underline">contact@oxelya.com</a></p>
            <p>Adresse : Oxelya - DPO, 32 Rue de Cantelaude, 33380 Marcheprime</p>
          </div>
          
          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <p className="text-sm">
              <strong>Autorité de contrôle :</strong> En cas de litige, vous pouvez saisir la 
              <Link href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                CNIL (Commission Nationale de l&apos;Informatique et des Libertés)
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="text-sm text-muted-foreground mt-12 p-4 border rounded-lg bg-muted/30">
        <p>
          <strong>Modifications :</strong> Cette politique peut être mise à jour pour refléter 
          les changements dans nos pratiques ou la législation. Nous vous informerons de tout 
          changement significatif par email ou notification sur le site.
        </p>
      </div>
    </div>
  );
}
