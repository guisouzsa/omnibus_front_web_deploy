"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type NotificationType =
  | "route_started"
  | "route_maintenance"
  | "checkpoint_reached"
  | "driver_changed"
  | "vehicle_changed"
  | "no_transport"
  | "route_finished"
  | "route_delayed"
  | "expense_added"
  | "route_assigned";

type FilterType = "all" | "route_started" | "route_finished" | "route_delayed" | "vehicle_changed" | "route_maintenance";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  read: boolean;
  filter_category: FilterType;
  related_id?: number;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1,  type: "route_started",      title: "Ônibus iniciou a rota",              description: "A rota da escola EEEP foi iniciada.",           date: "24 nov.", read: false, filter_category: "route_started",     related_id: 1 },
  { id: 2,  type: "route_maintenance",  title: "Mau funcionamento do veículo",       description: "Problema mecânico identificado no ônibus.",     date: "24 nov.", read: false, filter_category: "route_maintenance", related_id: 2 },
  { id: 3,  type: "route_started",      title: "Ônibus iniciou a rota",              description: "A rota da escola EEEP foi iniciada.",           date: "24 nov.", read: false, filter_category: "route_started",     related_id: 1 },
  { id: 4,  type: "vehicle_changed",    title: "Troca de veículo",                   description: "O veículo da rota foi substituído.",            date: "24 nov.", read: false, filter_category: "vehicle_changed",   related_id: 3 },
  { id: 5,  type: "vehicle_changed",    title: "Troca de veículo",                   description: "Novo ônibus atribuído à rota.",                 date: "24 nov.", read: true,  filter_category: "vehicle_changed",   related_id: 2 },
  { id: 6,  type: "route_delayed",      title: "Atraso na rota",                     description: "O ônibus vai sair com atraso hoje.",            date: "24 nov.", read: false, filter_category: "route_delayed",     related_id: 1 },
  { id: 7,  type: "route_finished",     title: "Rota finalizada",                    description: "A rota da escola EEEP foi concluída.",          date: "24 nov.", read: false, filter_category: "route_finished",    related_id: 1 },
  { id: 8,  type: "route_delayed",      title: "Atraso na rota",                     description: "Trânsito intenso causou atraso na rota.",       date: "24 nov.", read: false, filter_category: "route_delayed",     related_id: 1 },
  { id: 9,  type: "route_maintenance",  title: "Mau funcionamento do veículo",       description: "Falha no sistema de freios identificada.",      date: "23 nov.", read: true,  filter_category: "route_maintenance", related_id: 4 },
  { id: 10, type: "route_started",      title: "Ônibus iniciou a rota",              description: "A rota matutina da escola EEEP foi iniciada.",  date: "23 nov.", read: true,  filter_category: "route_started",     related_id: 5 },
  { id: 11, type: "route_finished",     title: "Rota finalizada",                    description: "Rota vespertina concluída com sucesso.",        date: "22 nov.", read: true,  filter_category: "route_finished",    related_id: 6 },
  { id: 12, type: "vehicle_changed",    title: "Troca de veículo",                   description: "Veículo reserva acionado para a rota.",         date: "22 nov.", read: true,  filter_category: "vehicle_changed",   related_id: 1 },
];

const FILTER_LABELS: Record<FilterType, string> = {
  all:               "Todas",
  route_started:     "Rotas iniciadas",
  route_finished:    "Rotas finalizadas",
  route_delayed:     "Atraso na rota",
  vehicle_changed:   "Troca de veículo",
  route_maintenance: "Mau funcionamento",
};

const TYPE_ICONS: Record<NotificationType, string> = {
  route_started:      "🚌",
  route_maintenance:  "🔧",
  checkpoint_reached: "📍",
  driver_changed:     "👤",
  vehicle_changed:    "🔄",
  no_transport:       "❌",
  route_finished:     "✅",
  route_delayed:      "⏰",
  expense_added:      "💰",
  route_assigned:     "📋",
};

export default function NotificacoesPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.filter_category === activeFilter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="page">
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

      <main className="main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">NOTIFICAÇÕES</h2>
          </div>

          <div className="toolbar">
            <div className="filters">
              {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
                <button
                  key={f}
                  className={`filter-btn${activeFilter === f ? " active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {FILTER_LABELS[f]}
                  {f === "all" && unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notif-list">
            {filtered.length === 0 && (
              <div className="empty">Nenhuma notificação encontrada.</div>
            )}
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`notif-row${n.read ? " read" : ""}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="notif-check">
                  <button
                    className={`checkbox${n.read ? " checked" : ""}`}
                    onClick={(e) => { e.stopPropagation(); toggleRead(n.id); }}
                  >
                    {n.read && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="notif-icon-cell">
                  <span className="notif-type-icon">{TYPE_ICONS[n.type]}</span>
                </div>

                <div className="notif-content">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-desc">{n.description}</span>
                </div>

                <div className="notif-actions">
                  <button className="action-icon" title="Ver detalhes" onClick={(e) => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                  <button className="action-icon" title="Arquivar" onClick={(e) => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>

                <div className="notif-date">{n.date}</div>
              </div>
            ))}
          </div>
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
        }

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
          font-weight: 500;
          color: #444;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .nav-link:hover {
          color: #1a1a1a;
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

        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          min-height: calc(100vh - 56px);
        }

        .card {
          background: #ffffff;
          border-radius: 5px;
          width: 85%;
          max-width: 1000px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
          overflow: hidden;
        }

        .card-header {
          background: #01233F;
          padding: 16px 28px;
          text-align: center;
        }

        .card-title {
          font-size: 15px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #f0f0f0;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          height: 32px;
          padding: 0 14px;
          border-radius: 20px;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          font-size: 12px;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.15s;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-btn:hover {
          border-color: #f1bb13;
          color: #1a1a1a;
        }

        .filter-btn.active {
          background: #01233F;
          border-color: #01233F;
          color: #ffffff;
        }

        .badge {
          background: #f1bb13;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          border-radius: 10px;
          padding: 1px 6px;
          line-height: 1.4;
        }

        .mark-all-btn {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          white-space: nowrap;
        }

        .mark-all-btn:hover {
          color: #01233F;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
        }

        .empty {
          padding: 40px;
          text-align: center;
          color: #aaa;
          font-size: 13px;
        }

        .notif-row {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          gap: 12px;
          transition: background 0.12s;
        }

        .notif-row:hover {
          background: #fafafa;
        }

        .notif-row.read {
          opacity: 0.6;
        }

        .notif-check {
          flex-shrink: 0;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          border: 1.5px solid #ccc;
          border-radius: 3px;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.15s, border-color 0.15s;
        }

        .checkbox.checked {
          background: #01233F;
          border-color: #01233F;
        }

        .notif-icon-cell {
          flex-shrink: 0;
          width: 28px;
          text-align: center;
          font-size: 16px;
        }

        .notif-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .notif-title {
          font-size: 12px;
          font-weight: 800;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .notif-desc {
          font-size: 12px;
          font-weight: 500;
          color: #777;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notif-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .action-icon {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          transition: background 0.15s;
          padding: 0;
        }

        .action-icon:hover {
          background: #f0f0f0;
        }

        .notif-date {
          font-size: 11px;
          color: #aaa;
          font-weight: 600;
          flex-shrink: 0;
          min-width: 48px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
          }

          .nav-links {
            gap: 16px;
          }

          .card {
            width: 95%;
          }

          .notif-title {
            white-space: normal;
          }

          .notif-desc {
            display: none;
          }

          .toolbar {
            padding: 10px 14px;
          }

          .notif-row {
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
}