"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const css = `
  /* FUNDO COM PADRÃO DE ROTAS */
  .oc-page { 
    min-height: 100vh; 
    background-color: #f4f7fa;
    background-image: 
      radial-gradient(at 0% 0%, rgba(1, 35, 63, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(241, 187, 19, 0.05) 0px, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2301233f' stroke-width='0.5' stroke-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    font-family: "Inter", "Segoe UI", sans-serif; 
    display: flex; 
  }

  /* SIDEBAR MAIS MODERNA */
  .oc-sidebar { width: 260px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; box-shadow: 4px 0 20px rgba(0,0,0,0.1); }
  .oc-sidebar-logo { padding: 32px 24px; display: flex; align-items: center; gap: 12px; }
  .oc-logo-icon { width: 40px; height: 40px; background: #f1bb13; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(241, 187, 19, 0.3); }
  .oc-logo-text { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  
  .oc-nav-item { 
    margin: 2px 16px;
    padding: 12px 16px; 
    border-radius: 12px; 
    font-size: 14px; 
    color: rgba(255,255,255,0.6); 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .oc-nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; transform: translateX(4px); }
  .oc-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 700; box-shadow: 0 4px 15px rgba(241, 187, 19, 0.2); }

  /* CONTEÚDO E TABELA */
  .oc-content-wrap { margin-left: 260px; flex: 1; display: flex; flex-direction: column; }
  .oc-main { padding: 40px; }
  
  .oc-card-table {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    overflow: hidden;
    padding: 24px;
  }

  .oc-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .oc-title { font-size: 14px; font-weight: 800; color: #01233F; opacity: 0.8; letter-spacing: 1.5px; }

  /* SEARCH INPUT ARREDONDADO */
  .oc-search-wrap { 
    background: #f0f2f5; 
    border: 1px solid transparent; 
    border-radius: 14px; 
    padding: 0 16px; 
    height: 48px; 
    display: flex; 
    align-items: center; 
    gap: 12px;
    transition: all 0.2s;
    width: 300px;
  }
  .oc-search-wrap:focus-within { background: #fff; border-color: #f1bb13; box-shadow: 0 0 0 4px rgba(241, 187, 19, 0.1); }

  .oc-btn-cadastrar { 
    background: #01233F; 
    color: #fff; 
    border-radius: 14px; 
    padding: 0 24px; 
    height: 48px; 
    font-weight: 700; 
    font-size: 14px;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .oc-btn-cadastrar:hover { background: #02345e; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(1, 35, 63, 0.2); }

  /* TABELA MODERNA */
  .oc-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
  .oc-table thead th { padding: 12px 20px; color: #6b7a8d; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
  .oc-table tbody tr { transition: transform 0.2s; }
  .oc-table tbody td { 
    background: #fff; 
    padding: 18px 20px; 
    border-top: 1px solid #f0f2f5; 
    border-bottom: 1px solid #f0f2f5; 
  }
  .oc-table tbody td:first-child { border-left: 1px solid #f0f2f5; border-radius: 16px 0 0 16px; }
  .oc-table tbody td:last-child { border-right: 1px solid #f0f2f5; border-radius: 0 16px 16px 0; }
  .oc-table tbody tr:hover td { background: #fafbfc; }

  /* BOTÕES DE OPERAÇÃO */
  .oc-btn-op {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 8px;
  }
  .oc-edit { background: rgba(1, 35, 63, 0.05); color: #01233F; }
  .oc-edit:hover { background: #01233F; color: #fff; }
  .oc-delete { background: rgba(239, 68, 68, 0.05); color: #ef4444; }
  .oc-delete:hover { background: #ef4444; color: #fff; }

  .oc-status-badge { 
    padding: 6px 12px; 
    border-radius: 10px; 
    font-size: 11px; 
    font-weight: 800; 
    background: #e0f2fe; 
    color: #0369a1; 
  }
`;

export default function OnibusCadastradosPage() {
  const router = useRouter();
  const { vehicles, loading, error, deleteVehicle } = useVehicles();
  const [search, setSearch] = useState("");

  const filtered = (vehicles || []).filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      (v.route?.name || v.mainRoute || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.driver?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="oc-page">
        {/* SIDEBAR */}
        <aside className="oc-sidebar">
          <div className="oc-sidebar-logo">
            <div className="oc-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="2.5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div className="oc-logo-text">Omnibus</div>
          </div>
          <nav className="oc-sidebar-nav">
            <button className="oc-nav-item" onClick={() => router.push("/dashboard")}>Dashboard</button>
            <button className="oc-nav-item active">Frota de Ônibus</button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_rotas")}>Gestão de Rotas</button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_motoristas")}>Motoristas</button>
          </nav>
          <div className="oc-sidebar-footer">
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="oc-content-wrap">
          <main className="oc-main">
            <div className="oc-top-bar">
              <div>
                <h2 className="oc-title">CONTROLE DE FROTA</h2>
                <h1 style={{fontSize: '28px', color: '#01233F', fontWeight: 800}}>Ônibus</h1>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div className="oc-search-wrap">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7a8d" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                   <input 
                    type="text" 
                    className="oc-search-input" 
                    placeholder="Filtrar por placa ou motorista..." 
                    style={{border:'none', background:'transparent', outline:'none', width: '100%'}}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
                <button className="oc-btn-cadastrar" onClick={() => router.push("/cadastro_onibus")}>
                  <span>+</span> Novo Veículo
                </button>
              </div>
            </div>

            <div className="oc-card-table">
              <table className="oc-table">
                <thead>
                  <tr>
                    <th>VEÍCULO / PLACA</th>
                    <th>CAPACIDADE</th>
                    <th>ROTA ATRIBUÍDA</th>
                    <th>MOTORISTA</th>
                    <th style={{textAlign: 'right'}}>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px', color: '#6b7a8d'}}>Nenhum veículo encontrado.</td></tr>
                  ) : (
                    filtered.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <div style={{fontWeight: 700, color: '#01233F'}}>{v.plate}</div>
                          <div style={{fontSize: '11px', color: '#6b7a8d'}}>ID: #{v.id}</div>
                        </td>
                        <td><span className="oc-status-badge" style={{background: '#f0fdf4', color: '#166534'}}>{v.capacity} Alunos</span></td>
                        <td>
                          {v.route_id ? <span className="oc-status-badge">{v.route?.name || v.mainRoute}</span> : <span className="oc-status-badge" style={{background: '#fef2f2', color: '#991b1b'}}>SEM ROTA</span>}
                        </td>
                        <td style={{color: '#475569', fontWeight: 500}}>{v.driver?.name || 'Não atribuído'}</td>
                        <td style={{textAlign: 'right'}}>
                          <button className="oc-btn-op oc-edit" title="Editar" onClick={() => router.push(`/editOnibus?id=${v.id}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          </button>
                          <button className="oc-btn-op oc-delete" title="Excluir" onClick={() => { if(confirm('Excluir?')) deleteVehicle(v.id) }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
