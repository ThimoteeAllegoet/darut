export default function Home() {
  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            marginBottom: '1rem',
          }}
        >
          Bienvenue sur DARUT
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--color-primary-blue)',
            marginBottom: '2rem',
          }}
        >
          Votre plateforme centralisée pour le suivi quotidien des anomalies et des projets
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          <div
            style={{
              padding: '2rem',
              backgroundColor: 'var(--color-white)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(29, 30, 60, 0.1)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--color-primary-dark)',
                marginBottom: '0.5rem',
              }}
            >
              Gestion des Anomalies
            </h2>
            <p style={{ color: 'var(--color-primary-blue)', fontSize: '0.95rem' }}>
              Priorisez et suivez les anomalies de toutes vos applications
            </p>
          </div>

          <div
            style={{
              padding: '2rem',
              backgroundColor: 'var(--color-white)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(29, 30, 60, 0.1)',
              opacity: 0.6,
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--color-primary-dark)',
                marginBottom: '0.5rem',
              }}
            >
              Suivi de Projet
            </h2>
            <p style={{ color: 'var(--color-primary-blue)', fontSize: '0.95rem' }}>
              À venir prochainement
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-light-blue)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--color-secondary-blue)',
          }}
        >
          <p style={{ color: 'var(--color-primary-dark)', fontSize: '0.95rem', margin: 0 }}>
            Utilisez le menu latéral pour accéder aux différents outils. Passez en mode écriture
            pour modifier les données.
          </p>
        </div>
      </div>
    </div>
  );
}
