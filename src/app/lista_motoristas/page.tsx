"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDrivers } from "@/hooks";

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  .md-page { min-height: 100vh; background: #f9f9f9; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }

  /* NAVBAR */
  .md-navbar { width: 100%; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 56px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .md-nav-links { display: flex; align-items: center; gap: 28px; }
  .md-nav-link { font-size: 13px; font-weight: 700; color: #01233F; letter-spacing: 0.5px; text-transform: uppercase; background: none; border: none; cursor: pointer; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .md-nav-link:hover { color: #888; }
  .md-nav-right { display: flex; align-items: center; gap: 16px; }
  .md-notif-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  .md-notif-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; color: #01233F; transition: opacity 0.15s; }
  .md-notif-btn:hover { opacity: 0.7; }
  .md-user-btn { background: #01233F; width: 36px; height: 36px; border: 2px solid #01233F; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: opacity 0.15s; padding: 0; color: #fff; }
  .md-user-btn:hover { opacity: 0.8; }

  /* MAIN */
  .md-main { padding: 32px 40px; }
  .md-content { width: 100%; }

  /* TOP BAR */
  .md-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .md-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; }
  .md-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 12px; height: 38px; flex: 1; min-width: 180px; gap: 8px; }
  .md-search-input { border: none; outline: none; font-size: 13px; color: #333; width: 100%; background: transparent; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .md-search-input::placeholder { color: #aaa; }
  .md-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .md-btn-cadastrar:hover { background: #dba900; }

  /* LISTA DE CARDS */
  .md-list { display: flex; flex-direction: column; gap: 12px; width: 100%; }

  /* CARD */
  .md-card { display: flex; align-items: center; background: #fff; border: 1px solid #e8e8e8; border-radius: 5px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .md-card-bar { width: 8px; align-self: stretch; flex-shrink: 0; background: #f1bb13; }
  .md-card-info { flex: 1; padding: 16px 20px; min-width: 0; }
  .md-card-name { font-size: 14px; font-weight: 800; color: #01233F; margin: 0 0 4px 0; }
  .md-card-cnh { font-size: 12px; margin: 0; }
  .md-card-label { font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #f1bb13; }
  .md-card-value { color: #666; }
  .md-divider { width: 1px; height: 48px; background: #e8e8e8; flex-shrink: 0; }
  .md-card-contact { flex: 1; padding: 16px 24px; min-width: 0; }
  .md-card-email { font-size: 12px; margin: 0 0 4px 0; }
  .md-card-phone { font-size: 12px; margin: 0; }
  .md-card-email-value { color: #01233F; text-decoration: underline; }
  .md-card-actions { display: flex; align-items: center; gap: 20px; padding: 0 24px; flex-shrink: 0; }
  .md-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .md-btn-excluir:hover { opacity: 0.7; }
  .md-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .md-btn-editar:hover { opacity: 0.6; }

  /* FEEDBACK */
  .md-feedback { text-align: center; font-size: 14px; padding: 48px 0; color: #aaa; }
  .md-feedback.error { color: #c0392b; }

  @media (max-width: 700px) {
    .md-main { padding: 20px 16px; }
    .md-top-bar { flex-direction: column; align-items: flex-start; }
    .md-search-wrap { width: 100%; }
    .md-card { flex-wrap: wrap; }
    .md-divider { display: none; }
    .md-card-contact { padding: 0 20px 16px; }
    .md-card-actions { padding: 0 20px 16px; }
  }
`;

export default function MotoristasPage() {
  const router = useRouter();
  const { drivers, loading, error, deleteDriver } = useDrivers();
  const [search, setSearch] = useState("");

  const filtered = (drivers || []).filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.license_number.includes(search)
  );

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o motorista ${name}?`)) {
      return;
    }

    try {
      await deleteDriver(id);
      alert("Motorista excluído com sucesso!");
    } catch (err: any) {
      alert(err.message || "Erro ao excluir motorista. Tente novamente.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editMotorista?id=${id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="md-page">

        {/* NAVBAR */}
        <nav className="md-navbar">
          <div className="md-nav-links">
            <button onClick={() => router.push("/dashboard")} className="md-nav-link">DASHBOARD</button>
            <button onClick={() => router.push("/financeiro")} className="md-nav-link">FINANCEIRO</button>
          </div>
          <div className="md-nav-right">
            <div className="md-notif-wrap">
              <button className="md-notif-btn" title="Notificações" onClick={() => router.push("/notificacoes")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </div>
            <button className="md-user-btn" title="Usuário" onClick={() => router.push("/perfil")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="md-main">
          <div className="md-content">

            {/* TOP BAR */}
            <div className="md-top-bar">
              <h2 className="md-title">MOTORISTAS CADASTRADOS</h2>
              <div className="md-search-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="md-search-input"
                  placeholder="Procurar motorista..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="md-btn-cadastrar" onClick={() => router.push("/cadastro_motorista")}>
                CADASTRAR MOTORISTA
              </button>
            </div>

            {/* LISTA */}
            {loading ? (
              <p className="md-feedback">Carregando motoristas...</p>
            ) : error ? (
              <p className="md-feedback error">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="md-feedback">Nenhum motorista encontrado.</p>
            ) : (
              <div className="md-list">
                {filtered.map((d) => (
                  <div key={d.id} className="md-card">
                    <div className="md-card-bar" />

                    {/* Nome + CNH */}
                    <div className="md-card-info">
                      <p className="md-card-name">{d.name}</p>
                      <p className="md-card-cnh">
                        <span className="md-card-label">CNH: </span>
                        <span className="md-card-value">{d.license_number}</span>
                      </p>
                    </div>

                    <div className="md-divider" />

                    {/* Email + Telefone */}
                    <div className="md-card-contact">
                      <p className="md-card-email">
                        <span className="md-card-label">Email: </span>
                        <span className="md-card-email-value">{d.email}</span>
                      </p>
                      <p className="md-card-phone">
                        <span className="md-card-label">Telefone: </span>
                        <span className="md-card-value">{d.phone_number}</span>
                      </p>
                    </div>

                    <div className="md-divider" />

                    {/* Ações */}
                    <div className="md-card-actions">
                      <button className="md-btn-excluir" onClick={() => handleDelete(d.id, d.name)}>EXCLUIR</button>
                      <button className="md-btn-editar" onClick={() => handleEdit(d.id)}>EDITAR</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}