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
          bottom: '-800px',
          right: '-500px',
          width: '1500px',
          height: '1500px',
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 433.47 460.49"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="var(--color-light-blue)"
          d="M391.65,86.98c-42.08-32.57-88.7-59.59-138.73-79.92-23.19-9.42-49.18-9.42-72.37,0-50.03,20.33-96.65,47.35-138.73,79.92-19.83,15.35-32.86,37.92-36.3,62.75C1.82,176.54,0,203.44,0,230.24c0,26.8,1.82,53.7,5.52,80.51,3.44,24.84,16.47,47.41,36.3,62.75,42.08,32.57,88.7,59.59,138.73,79.92,23.19,9.42,49.18,9.42,72.37,0,50.03-20.33,96.65-47.35,138.73-79.92,19.83-15.35,32.86-37.92,36.3-62.75,3.71-26.81,5.53-53.71,5.52-80.51,0-26.8-1.82-53.7-5.52-80.51-3.44-24.84-16.47-47.41-36.3-62.75"
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
      </div>
    </div>
  );
}
