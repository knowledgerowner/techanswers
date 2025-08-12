export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">À propos</h1>
        <p className="text-muted-foreground mt-2">
          Découvrez notre mission et notre équipe
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
          <p className="text-muted-foreground mb-4">
            BlogTech est né de la passion pour la technologie et le partage de connaissances. 
            Notre objectif est de fournir des contenus de qualité sur les dernières tendances 
            technologiques, les bonnes pratiques de développement et les innovations qui 
            façonnent notre monde numérique.
          </p>
          <p className="text-muted-foreground">
            Nous croyons en l'importance de rendre la technologie accessible à tous, 
            que vous soyez développeur débutant ou expert confirmé.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Nos Valeurs</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2">Qualité</h3>
              <p className="text-sm text-muted-foreground">
                Chaque article est soigneusement rédigé et vérifié pour garantir 
                la précision et la pertinence des informations.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Nous explorons constamment les nouvelles technologies et 
                partageons nos découvertes avec notre communauté.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2">Communauté</h3>
              <p className="text-sm text-muted-foreground">
                Nous encourageons les échanges et le partage de connaissances 
                entre développeurs et passionnés de tech.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2">Accessibilité</h3>
              <p className="text-sm text-muted-foreground">
                Nos contenus sont conçus pour être compréhensibles par tous, 
                quel que soit le niveau d'expertise.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
          <p className="text-muted-foreground mb-4">
            Notre blog couvre un large éventail de technologies modernes :
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js", "React", "TypeScript", "Node.js", "MongoDB", 
              "Prisma", "Tailwind CSS", "Docker", "AWS", "AI/ML"
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 