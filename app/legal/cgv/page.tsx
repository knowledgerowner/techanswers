import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CGVPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
          <Badge variant="outline" className="text-xs">CGV</Badge>
        </div>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
        <p className="mt-4">
          Les présentes conditions générales de vente régissent la vente d&apos;articles premium 
          sur la plateforme Oxelya.
        </p>
      </div>

      <Separator className="my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Définitions</h2>
        <div className="space-y-3">
          <div className="border border-muted rounded p-3">
            <p><strong>Vendeur :</strong> Oxelya</p>
          </div>
          <div className="border border-muted rounded p-3">
            <p><strong>Acheteur :</strong> Toute personne physique ou morale procédant à un achat sur le site</p>
          </div>
          <div className="border border-muted rounded p-3">
            <p><strong>Article Premium :</strong> Contenu numérique payant accessible après achat ou backlink</p>
          </div>
          <div className="border border-muted rounded p-3">
            <p><strong>Site :</strong> Site web accessible à l'adresse <Link href="https://www.oxelya.com" className="text-blue-600 hover:underline">oxelya.com</Link></p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Objet</h2>
        <p>
          Les présentes conditions générales de vente ont pour objet de définir les modalités 
          et conditions dans lesquelles Oxelya vend des articles premium (contenus 
          numériques) aux utilisateurs de son site web. Les articles sponsorisés sont rédigés par des rédacteurs indépendants et ne sont pas rédigés par Oxelya.    
        </p>
        <p className="mt-4">
          Toute commande implique l&apos;acceptation sans réserve des présentes conditions par l&apos;acheteur.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Produits et services</h2>
        
        <h3 className="text-xl font-semibold mb-3">3.1 Contenus et services</h3>
        <p className="mb-4">Oxelya propose les produits et services suivants :</p>
        
        <div className="space-y-4 mb-6">
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">📚 Articles premium</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Articles techniques approfondis</li>
              <li>Tutoriels avancés</li>
              <li>Guides pratiques spécialisés</li>
              <li>Analyses et études de cas</li>
            </ul>
          </div>
          
          <div className="border border-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">✍️ Articles sponsorisés / Publireportages</h4>
            <p className="text-sm mb-2">
              Services de rédaction d&apos;articles sur commande pour des entreprises tierces via des plateformes 
              comme GetFluence ou en direct.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Rédaction d&apos;articles techniques sur mesure</li>
              <li>Intégration de liens clients dans le contenu</li>
              <li>Respect des guidelines éditoriales du site</li>
              <li>Articles clairement identifiés comme sponsorisés</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">3.2 Transparence publicitaire</h3>
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg mb-4">
          <p className="font-medium mb-2">📢 Conformité légale</p>
          <p className="text-sm">
            Conformément à la loi sur la confiance dans l&apos;économie numérique et aux recommandations de l&apos;ARPP, 
            tous les contenus sponsorisés sont clairement identifiés comme tels (mentions "Sponsorisé", "Publireportage", "Partenariat").
          </p>
        </div>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Mention obligatoire "Article sponsorisé" ou "Publireportage"</li>
          <li>Identification claire du partenaire commercial</li>
          <li>Respect de l&apos;indépendance éditoriale</li>
          <li>Contenu de qualité maintenu malgré le caractère commercial</li>
          <li className="text-green-500 font-bold">Oxelya (ou TechAnswers) s&apos;engage à ne publier des articles sponsorisés que si le contenu lui semble pertinent et pertinent pour le lecteur.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">3.3 Caractéristiques</h3>
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Contenu numérique exclusif</li>
            <li>Accès illimité après achat</li>
            <li>Possibilité de téléchargement selon le format</li>
            <li>Mises à jour gratuites si applicable</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Conditions spécifiques aux articles sponsorisés</h2>
        
        <h3 className="text-xl font-semibold mb-3">4.1 Processus de commande</h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <p>Demande via GetFluence ou contact direct</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <p>Validation du brief et devis personnalisé</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <p>Paiement selon les modalités convenues</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <p>Rédaction et publication de l'article</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">4.2 Conditions éditoriales</h3>
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-4">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Respect de la ligne éditoriale technique du site</li>
            <li>Contenu de qualité et informatif obligatoire</li>
            <li>Refus des contenus purement promotionnels</li>
            <li>Validation finale par l'équipe éditoriale</li>
            <li>Droit de modification pour respecter le style maison</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mb-3">4.3 Durée de publication</h3>
        <p className="mb-4">
          Sauf accord contraire, les articles sponsorisés restent publiés de façon permanente sur le site. 
          Oxelya se réserve le droit de supprimer ou modifier un article en cas de :
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Non-conformité avec les conditions générales</li>
          <li>Contenu devenu obsolète ou inapproprié</li>
          <li>Demande légitime de suppression</li>
          <li>Obligations légales ou réglementaires</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Prix et paiement</h2>
        
        <h3 className="text-xl font-semibold mb-3">5.1 Prix</h3>
        <p className="mb-4">
          Les prix sont exprimés en euros (€) toutes taxes comprises (TTC). 
          La TVA applicable est celle en vigueur au jour de la commande.
        </p>
        
        <div className="border border-muted rounded p-4 mb-4">
          <p className="font-medium mb-2">Tarification :</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Articles Premium</span>
              <span className="font-medium">Prix fixé en € décidé par Oxelya ou l&apos;un de ses rédacteurs. Variation possibles.</span>
            </div>
            <div className="flex justify-between">
              <span>Articles sponsorisés / Publireportages</span>
              <span className="font-medium">Le tarif est indiqué sur la page <Link href="/partners" className="text-blue-600 hover:underline">Partenaires</Link></span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">5.2 Modalités de paiement</h3>
        <p className="mb-4">Le paiement s'effectue par carte bancaire via notre partenaire sécurisé Stripe pour les articles Premium. Les paiements sont effectués en euros (€) :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Visa, Mastercard, American Express</li>
          <li>Paiement immédiat et sécurisé</li>
          <li>Cryptage SSL 256 bits</li>
          <li>Aucune donnée bancaire stockée sur nos serveurs</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Commande et livraison</h2>
        
                  <h3 className="text-xl font-semibold mb-3">6.1 Processus de commande</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <p>Sélection de l'article premium</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <p>Connexion ou création de compte</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <p>Paiement sécurisé via Stripe</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <p>Accès immédiat au contenu</p>
          </div>
        </div>

                  <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Livraison</h3>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
          <p className="font-medium mb-2">📱 Livraison numérique instantanée</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Accès immédiat après validation du paiement</li>
            <li>Contenu disponible dans votre espace personnel</li>
            <li>Notification par email de confirmation</li>
            <li>Possibilité de consultation hors ligne selon le format</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Droit de rétractation</h2>
        
        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20 mb-4">
          <p className="font-medium mb-2">⚠️ Information importante</p>
          <p className="text-sm">
            Conformément à l&apos;article L. 221-28 du Code de la consommation, le droit de 
            rétractation ne peut être exercé pour les contenus numériques non fournis sur 
            un support matériel dont l&apos;exécution a commencé après accord préalable exprès 
            du consommateur et renoncement exprès à son droit de rétractation.
          </p>
        </div>

        <p>
          En procédant à l&apos;achat d&apos;un article premium, vous acceptez expressément que 
          la fourniture du contenu numérique commence immédiatement et renoncez à votre 
          droit de rétractation.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Exceptions</h3>
        <p>Le droit de rétractation peut s'appliquer dans les cas suivants :</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>Défaut de conformité du contenu</li>
          <li>Impossibilité technique d'accès au contenu</li>
          <li>Erreur manifeste dans la description du produit</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Garanties et responsabilité</h2>
        
        <h3 className="text-xl font-semibold mb-3">7.1 Garanties</h3>
        <p className="mb-4">Oxelya garantit :</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>La conformité du contenu à sa description</li>
          <li>L&apos;accessibilité technique du contenu</li>
          <li>La qualité et l'exactitude des informations</li>
          <li>La sécurité des transactions</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">7.2 Limitations de responsabilité</h3>
        <p className="mb-4">
          La responsabilité de Oxelya est limitée au montant de l&apos;achat. 
          Oxelya ne pourra être tenu responsable :
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Des dommages indirects ou immatériels</li>
          <li>De l&apos;utilisation inappropriée du contenu</li>
          <li>Des pertes de données dues à un défaut de l&apos;équipement de l&apos;acheteur</li>
          <li>De l&apos;interruption temporaire du service pour maintenance</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Propriété intellectuelle</h2>
        
        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg mb-4">
          <p className="font-medium mb-2">🛡️ Protection du contenu</p>
          <p className="text-sm">
            Tous les contenus premium sont protégés par le droit d&apos;auteur et la propriété 
            intellectuelle. Leur utilisation est strictement encadrée.
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3">8.1 Droits accordés</h3>
        <p className="mb-4">L&apos;achat d&apos;un article premium vous donne le droit de :</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Consulter le contenu à titre personnel</li>
          <li>Télécharger le contenu pour usage privé</li>
          <li>Imprimer le contenu pour usage personnel</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">8.2 Interdictions</h3>
        <p className="mb-4">Il est strictement interdit de :</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Reproduire, copier ou dupliquer le contenu</li>
          <li>Revendre ou céder l&apos;accès au contenu</li>
          <li>Diffuser le contenu sur d&apos;autres plateformes</li>
          <li>Modifier ou adapter le contenu</li>
          <li>Utiliser le contenu à des fins commerciales</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Service client et réclamations</h2>
        
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="font-medium mb-2">📞 Nous contacter</p>
          <div className="space-y-1 text-sm">
            <p>Email : <a href="mailto:contact@oxelya.com" className="text-blue-600 hover:underline">contact@oxelya.com</a></p>
            <p>Téléphone : +33 6 43 32 34 12</p>
            <p>Horaires : Lundi au vendredi, 9h-18h (heure de Paris)</p>
            <p>Délai de réponse : 24h ouvrées</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Données personnelles</h2>
        <p>
          Le traitement de vos données personnelles est régi par notre 
          <a href="/legal/privacy" className="text-blue-600 hover:underline ml-1">
            Politique de confidentialité
          </a>
          , conforme au RGPD.
        </p>
        <p className="mt-4">
          Vos données de facturation sont conservées 10 ans conformément aux obligations légales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Force majeure</h2>
        <p>
          Oxelya ne pourra être tenu responsable de l&apos;inexécution de ses obligations 
          en cas de force majeure ou de circonstances exceptionnelles indépendantes de sa volonté.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Droit applicable et juridiction</h2>
        <div className="space-y-4">
          <p>
            Les présentes conditions générales de vente sont soumises au droit français.
          </p>
          <p>
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm">
              <strong>Article L. 141-4 du Code de la consommation :</strong> 
              Le consommateur peut saisir à son choix, outre l&apos;une des juridictions 
              territorialement compétentes en vertu du code de procédure civile, la 
              juridiction du lieu où il demeurait au moment de la conclusion du contrat 
              ou de la survenance du fait dommageable.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Modifications</h2>
        <p>
          Oxelya se réserve le droit de modifier les présentes conditions générales 
          de vente à tout moment. Les nouvelles conditions s&apos;appliqueront aux commandes 
          passées après leur publication.
        </p>
        <p className="mt-4">
          Les conditions applicables sont celles en vigueur au moment de la passation de la commande.
        </p>
      </section>

      <div className="text-sm text-muted-foreground mt-12 p-4 border rounded-lg bg-muted/30">
        <p>
          <strong>Information légale :</strong> Conformément à l&apos;article 6 de la loi n° 2004-575 
          du 21 juin 2004 pour la confiance dans l&apos;économie numérique, ces conditions générales 
          de vente sont consultables et téléchargeables sur notre site web.
        </p>
      </div>
    </div>
  );
}
