"use client"; // Reemplaza al layout raíz si este falla: debe incluir <html> y <body>

export default function ErrorGlobal({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fbf8f3",
          color: "#1f1b16",
        }}
      >
        <title>Error · Destinos SV</title>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontSize: 48, margin: 0 }}>🌋</p>
          <h1 style={{ fontSize: 24 }}>El sitio tuvo un problema inesperado</h1>
          <p style={{ color: "#5b5348" }}>Intenta recargar la página en unos segundos.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 16,
              padding: "10px 22px",
              borderRadius: 999,
              border: 0,
              background: "#0f766e",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
