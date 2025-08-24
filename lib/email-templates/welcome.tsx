interface WelcomeEmailData {
  username: string;
  email: string;
  activationLink?: string;
}

export default function WelcomeTemplate({ username, email, activationLink }: WelcomeEmailData) {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)', 
        color: 'white', 
        padding: '40px 20px', 
        textAlign: 'center',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
          🎉 Bienvenue sur TechAnswers !
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
          Votre communauté technique de référence
        </p>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '40px 20px', 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#ffffff'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>
          Bonjour {username} !
        </h2>
        
        <p style={{ color: '#e0e0e0', lineHeight: '1.6', marginBottom: '20px' }}>
          Nous sommes ravis de vous accueillir dans la communauté TechAnswers ! 
          Vous faites maintenant partie d&apos;une communauté passionnée de développeurs, 
          experts en cybersécurité et passionnés de technologies.
        </p>

        <div style={{ 
          background: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '20px', 
          margin: '20px 0' 
        }}>
          <h3 style={{ color: '#495057', marginTop: 0, marginBottom: '15px' }}>
            🚀 Ce que vous pouvez faire dès maintenant :
          </h3>
          <ul style={{ color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
            <li>Explorer nos articles techniques et tutoriels</li>
            <li>Participer aux discussions et commentaires</li>
            <li>Accéder à nos ressources premium</li>
            <li>Recevoir nos newsletters hebdomadaires</li>
            <li>Partager vos connaissances avec la communauté</li>
          </ul>
        </div>

        {activationLink && (
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a 
              href={activationLink}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              ✅ Activer mon compte
            </a>
          </div>
        )}

        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
          Notre équipe d&apos;experts s&apos;engage à vous fournir du contenu de qualité 
          sur les dernières technologies et bonnes pratiques du développement web.
        </p>

        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
            💡 Prochaines étapes recommandées
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Commencez par explorer nos articles sur React, Next.js, 
            et la cybersécurité moderne !
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px 20px', 
        textAlign: 'center',
        borderTop: '1px solid #e9ecef'
      }}>
        <p style={{ color: '#666', margin: '0 0 15px 0' }}>
          <strong>TechAnswers</strong> - Votre source de connaissances techniques
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <a href="https://techanswers.com" style={{ color: '#667eea', textDecoration: 'none', margin: '0 10px' }}>
            🌐 Site web
          </a>
          <a href="https://techanswers.com/articles" style={{ color: '#667eea', textDecoration: 'none', margin: '0 10px' }}>
            📚 Articles
          </a>
          <a href="https://techanswers.com/contact" style={{ color: '#667eea', textDecoration: 'none', margin: '0 10px' }}>
            📧 Contact
          </a>
        </div>

        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          Cet email a été envoyé à {email}. 
          Si vous n&apos;avez pas créé de compte, vous pouvez ignorer cet email.
        </p>
      </div>
    </div>
  );
} 