"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OmnibusLanding() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 60% 40%, #475373 0%, #132b65 60%, #030810 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Stars */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(1px 1px at 5% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 15% 75%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 95% 80%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 5%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 90%, rgba(255,255,255,0.3) 0%, transparent 100%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "calc(100vw - 100px)",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "48px 56px 72px 56px",
          position: "relative",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          minHeight: "calc(100vh - 100px)",
          boxSizing: "border-box",
        }}
      >
        {/* Buttons top right */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "14px",
            marginBottom: "160px",
          }}
        >
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "transparent",
              border: "2px solid #333",
              color: "#333",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.07em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "transparent";
            }}
          >
            LOGIN
          </button>

          <button
            onClick={() => router.push("/cadastro")}
            style={{
              background: "#f5a623",
              border: "2px solid #f5a623",
              color: "#fff",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.07em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "#e09510";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "#f5a623";
            }}
          >
            COMEÇAR
          </button>
        </div>

        {/* Hero text */}
        <div style={{ maxWidth: "600px" }}>
          <h1
            style={{
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 700,
              color: "#f5a623",
              lineHeight: 1.3,
              margin: "0 0 20px 0",
              letterSpacing: "-0.01em",
            }}
          >
            Simplifique o transporte escolar
            <br />
            com a Omnibus
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#333",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Rotas organizadas, motoristas conectados e
            <br />
            tudo em tempo real.
          </p>
        </div>
      </div>
    </main>
  );
}