import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>
        <p className="text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      <Separator className="my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p><strong>Raison sociale :</strong> Oxelya</p>
          <p><strong>Forme juridique :</strong> Micro-entreprise</p>
          <p><strong>SIRET :</strong> 989 337 670 00016</p>
          <p><strong>Code APE :</strong> 4741Z - Commerce de détail d'ordinateurs, d'unités périphériques et de logiciels en magasin spécialisé</p>
          <p><strong>N° TVA intracommunautaire :</strong> FR989337670</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Siège social</h2>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p>Oxelya</p>
          <p>32 Rue de Cantelaude</p>
          <p>33380 Marcheprime, France</p>
          <p><strong>Téléphone :</strong> +33 6 43 32 34 12</p>
          <p><strong>Email :</strong> contact@oxelya.com</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Directeur de la publication</h2>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p><strong>Nom :</strong> Théo Morio</p>
          <p><strong>Qualité :</strong> Président de Oxelya</p>
          <p><strong>Email :</strong> admin@oxelya.com</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Hébergement</h2>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p><strong>Hébergeur :</strong> Vercel Inc.</p>
          <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
          <p><strong>Site web :</strong> <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</Link></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
        <p>
          Le contenu du site web Oxelya (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) 
          est la propriété exclusive de Oxelya, à l&apos;exception des marques, logos ou contenus 
          appartenant à d&apos;autres sociétés partenaires ou auteurs.
        </p>
        <p className="mt-4">
          Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des 
          éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation 
          écrite préalable de Oxelya.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Responsabilité</h2>
        <p>
          Oxelya s&apos;efforce de fournir sur le site des informations aussi précises que possible. 
          Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences 
          dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui 
          fournissent ces informations.
        </p>
        <p className="mt-4">
          Oxelya se réserve le droit de corriger, à tout moment et sans préavis, le contenu du site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Liens hypertextes</h2>
        <p>
          Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. 
          Oxelya ne dispose d&apos;aucun moyen pour contrôler le contenu de ces sites et décline 
          toute responsabilité quant à leur contenu.
        </p>
        <p className="mt-4">
          L&apos;existence d&apos;un lien depuis le site vers un autre site ne constitue pas une validation de ce site 
          ou de son contenu. Il appartient à l'internaute d'utiliser ces informations avec discernement et 
          esprit critique.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Loi applicable</h2>
        <p>
          Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront 
          seuls compétents.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
        <p>
          Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Par email : <Link href="mailto:contact@oxelya.com" className="text-blue-600 hover:underline">contact@oxelya.com</Link></li>
          <li>Par courrier : Oxelya, 32 Rue de Cantelaude, 33380 Marcheprime, France</li>
          <li>Par téléphone : +33 6 43 32 34 12</li>
        </ul>
      </section>

      <div className="text-sm text-muted-foreground mt-12 p-4 border rounded-lg bg-muted/30">
        <p>
          <strong>Note :</strong> Ces mentions légales peuvent être modifiées à tout moment. 
          Il est conseillé de les consulter régulièrement. Date de dernière modification : les changements dans nos pratiques ou la législation. Nous vous informerons de tout
          changement significatif par email ou notification sur le site. {new Date().toLocaleDateString('fr-FR')}.
        </p>
      </div>
    </div>
  );
}
