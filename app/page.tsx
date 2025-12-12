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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hexagonal SVG Background */}
      <svg
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 460.51 460.49"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="var(--color-primary-dark)"
          d="M387.41,443.39c-13.41,4.93-27.77,7.66-42,9.64-76.79,9.97-154.28,9.96-231.07-.12-28.18-3.85-58.29-11.58-78-33.13-18.28-19.64-25.1-47.5-28.7-73.65C-2.17,267.94-6.5,140.82,19.61,67.08,35.63,26.57,76.17,11.94,116.5,7.34c81.9-10.14,165.1-10.4,246.61,3.14,22.52,4.41,45.32,13.1,60.95,30.1,48.52,47.02,38.47,250.73,26.91,317.84-6.2,38.66-24.69,71.77-63.48,84.94l-.08.03Z"
        />
      </svg>

      <div
        style={{
          maxWidth: '800px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
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
