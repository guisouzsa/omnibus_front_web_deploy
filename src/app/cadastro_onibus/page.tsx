"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroOnibusPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    placa: "",
    capacidade: "",
    rotaPrincipal: "",
    motoristaPrincipal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="page">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={() => router.push("/dashboard")} className="nav-link">DASHBOARD</button>
          <button onClick={() => router.push("/financeiro")} className="nav-link">FINANCEIRO</button>
        </div>

        <div className="nav-right">
          <button className="icon-btn notif-icon-btn" title="Notificações" onClick={() => router.push("/notificacoes")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button className="icon-btn user-icon-btn" title="Usuário" onClick={() => router.push("/perfil")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── CONTEÚDO ── */}
      <main className="main">
        <h2 className="page-title">CADASTRE UM NOVO ÔNIBUS</h2>

        <div className="card">
          <form onSubmit={handleSubmit}>

            {/* Linha 1: PLACA + CAPACIDADE lado a lado */}
            <div className="row">
              <div className="field">
                <label className="label">PLACA DO VEÍCULO</label>
                <input
                  type="text"
                  name="placa"
                  className="input"
                  placeholder="Ex: 240409CP"
                  value={form.placa}
                  onChange={handleChange}
                />
              </div>
              <div className="field field-small">
                <label className="label">CAPACIDADE</label>
                <input
                  type="number"
                  name="capacidade"
                  className="input"
                  placeholder="Ex: 66"
                  value={form.capacidade}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 2: ROTA PRINCIPAL */}
            <div className="field">
              <label className="label">ROTA PRINCIPAL</label>
              <input
                type="text"
                name="rotaPrincipal"
                className="input"
                placeholder="Ex: Poço Redondo"
                value={form.rotaPrincipal}
                onChange={handleChange}
              />
            </div>

            {/* Linha 3: MOTORISTA PRINCIPAL */}
            <div className="field">
              <label className="label">MOTORISTA PRINCIPAL</label>
              <input
                type="text"
                name="motoristaPrincipal"
                className="input"
                placeholder="Ex: Raimundo Souza"
                value={form.motoristaPrincipal}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn">
              CADASTRAR
            </button>

          </form>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── NAVBAR ── */
        .navbar {
          width: 100%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 56px;
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          font-size: 13px;
          font-weight: 800;
          color: #01233F;
          text-decoration: none;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .nav-link:hover {
          color: #01233F;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: background 0.15s;
          padding: 0;
        }

        .icon-btn:hover {
          background: #f5f5f5;
        }

        .notif-icon-btn {
          background: none;
          width: 34px;
          height: 34px;
        }

        .notif-icon-btn:hover {
          background: #f5f5f5;
        }

        .user-icon-btn {
          background: #01233F;
          width: 34px;
          height: 34px;
        }

        .user-icon-btn:hover {
          background: #013560;
        }

        /* ── MAIN ── */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }

        .page-title {
          font-size: 18px;
          font-weight: 900;
          color: #01233F;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 24px;
          text-align: center;
        }

        /* ── CARD ── */
        .card {
          background: #ffffff;
          border-radius: 5px;
          padding: 40px 40px 36px;
          width: 100%;
          max-width: 860px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        /* ── LINHA COM 2 CAMPOS ── */
        .row {
          display: grid;
          grid-template-columns: 1fr 160px;
          gap: 16px;
          margin-bottom: 0;
        }

        .row .field {
          margin-bottom: 16px;
        }

        /* ── CAMPOS ── */
        .field {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 11px;
          font-weight: 800;
          color: #222;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          height: 52px;
          border: 1.5px solid #e0e0e0;
          border-radius: 4px;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 400;
          color: #333;
          background: #F3F3F3;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .input::placeholder {
          color: #ACACAC;
          font-size: 14px;
          font-weight: 800;
        }

        .input:focus {
          border-color: #f1bb13;
          background: #fff;
        }

        /* ── BOTÃO ── */
        .btn {
          width: 100%;
          height: 54px;
          background: #f1bb13;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #ffffff;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s, transform 0.1s;
        }

        .btn:hover {
          background: #dba900;
          transform: translateY(-1px);
        }

        .btn:active {
          transform: translateY(0);
          background: #c79800;
        }

        /* ── RESPONSIVO ── */
        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
          }

          .nav-links {
            gap: 16px;
          }

          .main {
            padding: 32px 16px;
          }

          .card {
            padding: 24px 20px;
          }

          .page-title {
            font-size: 15px;
          }

          .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}