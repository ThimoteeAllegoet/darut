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
          La plateforme centralisée pour le suivi des anomalies et des projets
        </p>

        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-light-blue)',
            borderRadius: '8px',
          }}
        >
          <p style={{ color: 'var(--color-primary-dark)', fontSize: '0.95rem', margin: 0 }}>
            Utilisez le menu latéral pour accéder aux différents outils. Passez en mode Administrateur
            pour modifier les données.
          </p>
        </div>
      </div>
    </div>
  );
}
