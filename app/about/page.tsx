"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          À propos de TechAnswers
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Découvrez l&apos;histoire, la mission et l&apos;équipe derrière TechAnswers, 
          votre ressource de référence pour le développement web moderne et les technologies émergentes.
        </p>
      </div>

      {/* Notre Histoire */}
      <section className="mb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="mb-6">
                TechAnswers est né en 2024 de la vision d&apos;Oxelya, une entreprise spécialisée dans les services numériques, 
                de créer une plateforme éducative de référence dans l&apos;écosystème technologique français. 
                Face à la complexité croissante du développement web moderne et à la multiplication des frameworks 
                et outils, nous avons identifié un besoin crucial : une ressource centralisée, fiable et accessible 
                pour les développeurs de tous niveaux.
              </p>
              <p className="mb-6">
                L&apos;idée est née d&apos;un constat simple : trop de développeurs passent des heures à chercher des solutions 
                à des problèmes techniques, naviguant entre des documentations parfois obsolètes, des tutoriels 
                incomplets et des forums aux réponses contradictoires. TechAnswers s&apos;est donné pour mission de 
                combler ce fossé en proposant des articles techniques approfondis, des tutoriels pratiques et 
                des guides étape par étape.
              </p>
              <p>
                Aujourd&apos;hui, TechAnswers est devenu une communauté dynamique de développeurs, d&apos;architectes logiciels 
                et de passionnés de technologie, partageant leurs connaissances et expériences pour faire avancer 
                l&apos;ensemble de l&apos;écosystème tech français.
              </p>
            </div>
          </div>
          <div className="relative">
            <Card className="border-2 border-primary/20 p-8">
              <CardContent className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
                  O
                </div>
                <h3 className="text-2xl font-bold mb-2">Créé par Oxelya</h3>
                <p className="text-muted-foreground mb-4">
                  Entreprise de Services Numériques
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Badge variant="outline">Développement Web</Badge>
                  <Badge variant="outline">Cybersécurité</Badge>
                  <Badge variant="outline">SEO</Badge>
                </div>
                <Link href="https://www.oxelya.com" target="_blank">
                  <Button variant="outline" size="sm">
                    Visiter Oxelya
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="mb-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Mission</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rendre le développement web moderne accessible, compréhensible et maîtrisable pour tous
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Éducation</h3>
              <p className="text-muted-foreground">
                Fournir des ressources éducatives de qualité, des tutoriels pratiques et des guides 
                détaillés pour tous les niveaux de compétence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Communauté</h3>
              <p className="text-muted-foreground">
                Créer un espace d&apos;échange et de partage où les développeurs peuvent apprendre, 
                collaborer et grandir ensemble.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Explorer et partager les dernières tendances technologiques, frameworks 
                et bonnes pratiques du développement moderne.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ce que nous faisons */}
      <section className="mb-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que nous faisons</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 place-items-center place-content-center">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  Articles Techniques
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nous publions régulièrement des articles approfondis sur les technologies web modernes, 
                  couvrant React, Next.js, TypeScript, Node.js, et bien d&apos;autres sujets techniques. 
                  Chaque article est soigneusement rédigé par notre équipe d&apos;experts, avec des exemples 
                  pratiques et des explications détaillées.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Tutoriels</Badge>
                  <Badge variant="outline">Best Practices</Badge>
                  <Badge variant="outline">Code Examples</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  Solutions Pratiques
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nous proposons des solutions concrètes aux problèmes techniques courants que rencontrent 
                  les développeurs au quotidien. De la configuration d&apos;environnements de développement 
                  à l&apos;optimisation des performances, nous couvrons tous les aspects du développement web.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Debugging</Badge>
                  <Badge variant="outline">Optimization</Badge>
                  <Badge variant="outline">Troubleshooting</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  Veille Technologique
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nous suivons de près l&apos;évolution des technologies web et partageons nos découvertes 
                  avec notre communauté. Nouveaux frameworks, mises à jour importantes, tendances émergentes : 
                  nous analysons et expliquons tout ce qui compte pour les développeurs modernes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Trends</Badge>
                  <Badge variant="outline">Updates</Badge>
                  <Badge variant="outline">Analysis</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  Conseils d&apos;Experts
                </h3>
                <p className="text-muted-foreground mb-4">
                  Notre équipe d&apos;experts partage ses années d&apos;expérience à travers des conseils pratiques, 
                  des bonnes pratiques et des retours d&apos;expérience. Architecture logicielle, sécurité, 
                  performance : nous abordons tous les aspects critiques du développement professionnel.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Architecture</Badge>
                  <Badge variant="outline">Security</Badge>
                  <Badge variant="outline">Performance</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="mb-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Qualité</h3>
              <p className="text-sm text-muted-foreground">
                Chaque contenu est soigneusement vérifié et testé pour garantir sa précision et sa pertinence.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🌱</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Accessibilité</h3>
              <p className="text-sm text-muted-foreground">
                Nos contenus sont conçus pour être compréhensibles par tous, quel que soit le niveau d&apos;expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🔄</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Nous explorons constamment les nouvelles technologies et partageons nos découvertes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🤝</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Communauté</h3>
              <p className="text-sm text-muted-foreground">
                Nous encourageons les échanges et le partage de connaissances entre développeurs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

             {/* Technologies couvertes */}
       <section className="mb-16 max-w-full">
         <h2 className="text-3xl font-bold text-center mb-12">Technologies que nous couvrons</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-80/100 mx-auto">
           <Card className="col-span-1 lg:col-span-2">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">⚛️</span>
                 Frontend
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular", 
                   "Svelte", "SvelteKit", "Nuxt.js", "Gatsby", "Remix", "Astro", "Solid.js",
                   "Preact", "Alpine.js", "Stimulus", "Ember.js", "Backbone.js", "jQuery",
                   "Web Components", "Lit", "Stencil", "Storybook", "Cypress", "Playwright"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🖥️</span>
                 Backend
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Node.js", "Python", "Express", "FastAPI", "Django", "NestJS", "Flask",
                   "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET Core", "Go", "Rust",
                   "Elixir", "Phoenix", "Koa", "Hapi", "AdonisJS", "Strapi", "Directus",
                   "Sanity", "Contentful", "GraphQL", "REST APIs", "gRPC", "WebSockets"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🗄️</span>
                 Base de données
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "MongoDB", "PostgreSQL", "MySQL", "Redis", "Prisma", "TypeORM", "SQLite",
                   "MariaDB", "Cassandra", "CouchDB", "Neo4j", "InfluxDB", "Elasticsearch",
                   "DynamoDB", "Firebase", "Supabase", "PlanetScale", "CockroachDB", "TimescaleDB",
                   "ArangoDB", "RethinkDB", "Fauna", "Dgraph", "Memgraph", "OrientDB"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="col-span-1">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">☁️</span>
                 Cloud & DevOps
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "AWS", "Docker", "Kubernetes", "Vercel", "Netlify", "GitHub Actions", "Azure",
                   "Google Cloud", "DigitalOcean", "Heroku", "Railway", "Render", "Fly.io",
                   "Terraform", "Ansible", "Jenkins", "GitLab CI", "CircleCI", "Travis CI",
                   "ArgoCD", "Helm", "Istio", "Prometheus", "Grafana", "ELK Stack", "Datadog"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="col-span-1 lg:col-span-3">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🔒</span>
                 Sécurité
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "OWASP", "JWT", "OAuth", "HTTPS", "CORS", "XSS Protection", "CSRF",
                   "SQL Injection", "Penetration Testing", "Burp Suite", "Nmap", "Metasploit",
                   "Wireshark", "Snort", "Fail2ban", "ModSecurity", "Let&apos;s Encrypt", "SSL/TLS",
                   "2FA", "MFA", "Biometric Auth", "Zero Trust", "VPN", "Firewall", "IDS/IPS"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="col-span-1 lg:col-span-2">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🤖</span>
                 IA & ML
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "OpenAI", "TensorFlow", "PyTorch", "LangChain", "Hugging Face", "ChatGPT",
                   "Claude", "Gemini", "BERT", "GPT-4", "DALL-E", "Midjourney", "Stable Diffusion",
                   "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter",
                   "MLflow", "Kubeflow", "Weights & Biases", "Comet", "Neural Networks", "Deep Learning"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">📱</span>
                 Mobile & PWA
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "React Native", "Flutter", "Ionic", "Cordova", "Capacitor", "Expo",
                   "NativeScript", "Xamarin", "Swift", "Kotlin", "SwiftUI", "Jetpack Compose",
                   "PWA", "Service Workers", "Web App Manifest", "IndexedDB", "WebAssembly",
                   "Tauri", "Electron", "Progressive Web Apps", "App Clips", "Instant Apps"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🎮</span>
                 Gaming & 3D
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Three.js", "WebGL", "Babylon.js", "PlayCanvas", "Unity", "Unreal Engine",
                   "Godot", "Phaser", "PixiJS", "Matter.js", "Cannon.js", "Ammo.js", "WebXR",
                   "WebVR", "AR.js", "A-Frame", "React Three Fiber", "Drei", "Leva", "Zustand",
                   "Redux Toolkit", "Socket.io", "WebRTC", "Web Audio API", "Canvas API"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">⚡</span>
                 Performance & Monitoring
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Lighthouse", "WebPageTest", "Core Web Vitals", "Bundle Analyzer", "Webpack",
                   "Vite", "Rollup", "esbuild", "SWC", "Turbo", "Nx", "Lerna", "Yarn Workspaces",
                   "npm", "pnpm", "Sentry", "LogRocket", "FullStory", "Hotjar", "Google Analytics",
                   "Mixpanel", "Amplitude", "Segment", "PostHog", "Plausible", "Fathom"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🔧</span>
                 Outils & Utilitaires
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Git", "GitHub", "GitLab", "Bitbucket", "VS Code", "WebStorm", "Vim",
                   "Neovim", "Emacs", "Postman", "Insomnia", "Thunder Client", "Figma",
                   "Sketch", "Adobe XD", "InVision", "Zeplin", "Storybook", "Chromatic",
                   "Jest", "Vitest", "Cypress", "Playwright", "Selenium", "Appium"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="col-span-1 lg:col-span-2">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🌐</span>
                 Web3 & Blockchain
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Ethereum", "Solidity", "Web3.js", "Ethers.js", "Hardhat", "Truffle",
                   "OpenZeppelin", "IPFS", "Filecoin", "Polygon", "BSC", "Cardano", "Solana",
                   "Rust", "Anchor", "Metaplex", "NFTs", "DeFi", "Smart Contracts", "DApps",
                   "MetaMask", "WalletConnect", "Rainbow", "Uniswap", "OpenSea", "Alchemy"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">📊</span>
                 Data & Analytics
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Apache Kafka", "Apache Spark", "Apache Airflow", "dbt", "Snowflake",
                   "BigQuery", "Redshift", "Databricks", "Tableau", "Power BI", "Looker",
                   "Metabase", "Grafana", "Kibana", "Apache Superset", "Streamlit", "Dash",
                   "Plotly", "D3.js", "Chart.js", "Recharts", "Apache NiFi", "Talend", "Informatica"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="col-span-1 lg:col-span-3">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-xl">🔍</span>
                 SEO & Marketing
               </h3>
               <div className="flex flex-wrap gap-2">
                 {[
                   "Google Analytics", "Google Search Console", "SEMrush", "Ahrefs", "Moz",
                   "Screaming Frog", "GTmetrix", "PageSpeed Insights", "Schema.org", "Structured Data",
                   "Meta Tags", "Open Graph", "Twitter Cards", "Sitemaps", "Robots.txt", "Canonical URLs",
                   "Internal Linking", "Backlink Analysis", "Keyword Research", "Content Optimization",
                   "Technical SEO", "Local SEO", "E-commerce SEO", "Voice Search", "Core Web Vitals"
                 ].map((tech) => (
                   <Badge key={tech} variant="outline" className="text-xs">
                     {tech}
                   </Badge>
                 ))}
               </div>
             </CardContent>
           </Card>
         </div>
       </section>

      {/* CTA Section */}
      <section className="mb-16">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez notre communauté</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Que vous soyez développeur débutant ou expert confirmé, TechAnswers est là pour vous accompagner 
              dans votre parcours technologique. Découvrez nos articles, partagez vos expériences et grandissez avec nous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/articles">
                <Button size="lg" className="w-full sm:w-auto">
                  Explorer nos articles
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section SEO */}
      <section className="prose prose-lg dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-6">TechAnswers - Votre partenaire pour le développement web moderne</h2>
        <p className="mb-4">
          TechAnswers est une plateforme éducative française dédiée au développement web moderne et aux technologies émergentes. 
          Créée par l&apos;entreprise Oxelya, spécialisée dans les services numériques, notre mission est de démocratiser 
          l&apos;accès aux connaissances techniques de pointe et de former la prochaine génération de développeurs web.
        </p>
        <p className="mb-4">
          Notre équipe d&apos;experts combine des années d&apos;expérience dans le développement full-stack, la cybersécurité, 
          l&apos;optimisation SEO et l&apos;assistance informatique. Cette expertise diversifiée nous permet d&apos;aborder 
          tous les aspects du développement web moderne, de la conception à la mise en production, en passant 
          par la sécurité et l&apos;optimisation des performances.
        </p>
        <p className="mb-4">
          Nous couvrons un large éventail de technologies, des frameworks frontend populaires comme React et Next.js 
          aux solutions backend robustes comme Node.js et Python, en passant par les bases de données modernes 
          et les outils de déploiement cloud. Notre approche pédagogique s&apos;adapte à tous les niveaux, 
          des débutants cherchant à comprendre les fondamentaux aux experts explorant les dernières innovations.
        </p>
        <p>
          Rejoignez notre communauté grandissante de développeurs passionnés et accédez à des ressources 
          éducatives de qualité, des tutoriels pratiques et des insights techniques qui vous aideront 
          à exceller dans votre carrière de développeur web.
        </p>
      </section>
    </div>
  );
} 