"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import { useSchools } from "@/hooks/useSchools";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

// ─── Icons (PADRÃO MOTORISTA) ────────────────────────────────────────────────
function BusSideIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 30" fill="none">
      <rect x="0" y="0" width="38" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
      <circle cx="8" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
      <circle cx="30" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
    </svg>
  );
}

function RouteIconFilled({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>
  );
}

function BusFrontIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6h16v10H4z"/>
    </svg>
  );
}

function FinanceIconFilled({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2v20"/>
    </svg>
  );
}

function BellIconFilled({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a6 6 0 0 0-6 6v5l-2 2h16l-2-2V8a6 6 0 0 0-6-6z"/>
    </svg>
  );
}

function DashIconFilled({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}

// ─── CSS (IGUAL MOTORISTA) ───────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:#01233F;
  --yellow:#f1bb13;
  --yellow-dark:#d9a700;
  --bg:#f0f2f5;
  --border:#e2e6ea;
  --muted:#6b7a8d;
  --sidebar-w:220px;
}

body { font-family:'DM Sans',sans-serif; }

.layout { display:flex; min-height:100vh; background:var(--bg); }

/* LOADING IGUAL MOTORISTA */
.loading-screen {
  position:fixed; inset:0;
  background:var(--navy);
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  gap:16px;
}
.loading-spinner {
  width:40px; height:40px;
  border:2px solid rgba(241,187,19,0.2);
  border-top-color:var(--yellow);
  border-radius:50%;
  animation:spin .8s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }
.loading-label { color:#fff; font-weight:600; }

/* SIDEBAR */
.sidebar {
  width:var(--sidebar-w);
  background:var(--navy);
  position:fixed; top:0; left:0; bottom:0;
  display:flex; flex-direction:column;
}

.sidebar-logo {
  padding:20px;
  border-bottom:1px solid rgba(255,255,255,.08);
  display:flex; gap:10px;
}

.logo-text { color:#fff; font-weight:700; }

.sidebar-nav { flex:1; padding:20px 12px; }

.nav-item {
  display:flex; gap:10px;
  padding:10px;
  border:none;
  background:none;
  color:rgba(255,255,255,.6);
  cursor:pointer;
}
.nav-item.active {
  background:var(--yellow);
  color:var(--navy);
  border-radius:8px;
}

/* CONTENT */
.content { margin-left:var(--sidebar-w); flex:1; }

.topbar {
  height:60px;
  background:#fff;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 30px;
  border-bottom:1px solid var(--border);
}

.topbar-title { font-weight:700; color:var(--navy); }

.icon-btn {
  width:38px; height:38px;
  border:none;
  border-radius:50%;
  background:transparent;
}

.body { padding:40px; display:flex; justify-content:center; }

.card {
  background:#fff;
  padding:40px;
  border-radius:12px;
  width:100%;
  max-width:800px;
  border:1px solid var(--border);
}

.input {
  width:100%;
  height:52px;
  border:1px solid var(--border);
  border-radius:8px;
  padding:0 16px;
  background:#f7f8fa;
}

.btn {
  width:100%;
  height:52px;
  background:var(--yellow);
  border:none;
  color:#fff;
  font-weight:600;
  margin-top:10px;
  cursor:pointer;
}
`;

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function CadastroRotaPage() {
  const router = useRouter();
  const { createRoute, getAddressesByCep, loading } = useRoutes(false);
  const { schools, fetchSchools } = useSchools(false);

  const [form, setForm] = useState({
    name: "",
    start_point_cep: "",
    start_point: "",
    start_point_reference: "",
    departure_time: "",
    school_id: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    fetchSchools({ per_page: 100 });
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCep = async () => {
    setLoadingCep(true);
    await getAddressesByCep(form.start_point_cep);
    setLoadingCep(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createRoute(form);
    router.push("/lista_rotas");
  };

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="loading-screen">
          <div className="loading-spinner" />
          <div className="loading-label">Carregando</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <BusSideIcon />
            <div className="logo-text">Omnibus</div>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item" onClick={() => router.push("/dashboard")}>
              <DashIconFilled /> Dashboard
            </button>

            <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}>
              <FinanceIconFilled /> Financeiro
            </button>

            <button className="nav-item">
              <BusFrontIcon /> Ônibus
            </button>

            <button className="nav-item active">
              <RouteIconFilled /> Rotas
            </button>
          </nav>

          <SidebarLogoutButton />
        </aside>

        {/* CONTENT */}
        <div className="content">

          <header className="topbar">
            <div className="topbar-title">Cadastrar Rota</div>
            <button className="icon-btn">
              <BellIconFilled />
            </button>
          </header>

          <div className="body">
            <div className="card">

              <form onSubmit={handleSubmit}>

                <input
                  className="input"
                  name="name"
                  placeholder="Nome da rota"
                  onChange={handleChange}
                />

                <input
                  className="input"
                  name="start_point_cep"
                  placeholder="CEP"
                  onChange={handleChange}
                />

                <button type="button" className="btn" onClick={handleCep}>
                  {loadingCep ? "Buscando..." : "Buscar CEP"}
                </button>

                <input
                  className="input"
                  name="start_point_reference"
                  placeholder="Referência"
                  onChange={handleChange}
                />

                <input
                  className="input"
                  name="departure_time"
                  type="time"
                  onChange={handleChange}
                />

                <select className="input" name="school_id" onChange={handleChange}>
                  <option value="">Escola</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <button className="btn">Cadastrar Rota</button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
