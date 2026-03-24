"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useExpenses, useSpendingLimits } from "@/hooks";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────
const systemStatus = [
  { id: "buses",   label: "Ônibus Cadastrados",    value: 42,   icon: "bus",     change: "+3 este mês"   },
  { id: "routes",  label: "Rotas Cadastradas",     value: 18,   icon: "route",   change: "+1 esta semana" },
  { id: "drivers", label: "Motoristas Cadastrados", value: 97,  icon: "driver",  change: "+5 este mês"   },
  { id: "students",label: "Alunos Transportados",  value: 1240, icon: "student", change: "+28 este mês"  },
];

const chartData = [
  { mes: "Jan", valor: 210000 },
  { mes: "Fev", valor: 195000 },
  { mes: "Mar", valor: 220000 },
  { mes: "Abr", valor: 205000 },
  { mes: "Mai", valor: 195000 },
  { mes: "Jun", valor: 230000 },
  { mes: "Jul", valor: 215000 },
  { mes: "Ago", valor: 240000 },
  { mes: "Set", valor: 225000 },
  { mes: "Out", valor: 210000 },
  { mes: "Nov", valor: 220000 },
  { mes: "Dez", valor: 130000 },
];

const financialMetrics = [
  { label: "Meta de Gastos",         value: "R$ 340.000", sub: "por mês",      color: "#01233F" },
  { label: "Gastos do Mês Atual",    value: "R$ 130.000", sub: "em andamento", color: "#f1bb13" },
  { label: "Menor Gasto Registrado", value: "R$ 195.000", sub: "Mai/2025",     color: "#22c55e" },
];

const recentActivity = [
  { type: "bus",    text: "Ônibus #07 adicionado à frota",         time: "há 12 min",  status: "new"     },
  { type: "route",  text: "Rota Norte-Sul atualizada",             time: "há 45 min",  status: "update"  },
  { type: "driver", text: "Motorista Carlos Silva cadastrado",     time: "há 2 horas", status: "new"     },
  { type: "alert",  text: "Manutenção preventiva: Ônibus #03",     time: "há 3 horas", status: "warning" },
  { type: "route",  text: "Rota Leste desativada temporariamente", time: "há 5 horas", status: "warning" },
];

const occupancyData = [
  { rota: "Norte", ocupacao: 87 },
  { rota: "Sul",   ocupacao: 64 },
  { rota: "Leste", ocupacao: 45 },
  { rota: "Oeste", ocupacao: 92 },
  { rota: "Centro",ocupacao: 78 },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function BusIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="2"/>
      <path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
      <circle cx="7" cy="20" r="2" fill={color} stroke={color}/>
      <circle cx="17" cy="20" r="2" fill={color} stroke={color}/>
      <path d="M5 18h14"/>
    </svg>
  );
}

function RouteIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

function DriverIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
      <path d="M8 7 Q12 3 16 7" fill="none"/>
    </svg>
  );
}

function StudentIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}

function FinanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

const ICON_MAP: Record<string, (p: any) => JSX.Element> = {
  bus: BusIcon, route: RouteIcon, driver: DriverIcon, student: StudentIcon,
};

const STATUS_COLORS: Record<string, string> = {
  new: "#22c55e", update: "#3b82f6", warning: "#f59e0b",
};
const STATUS_LABELS: Record<string, string> = {
  new: "Novo", update: "Atualização", warning: "Alerta",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #01233F;
    --yellow: #f1bb13;
    --yellow-dark: #d9a700;
    --bg: #f0f2f5;
    --card: #ffffff;
    --border: #e2e6ea;
    --text: #1a2535;
    --muted: #6b7a8d;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --sidebar-w: 220px;
  }

  body { font-family: 'DM Sans', sans-serif; }

  .db-layout { display: flex; min-height: 100vh; background: var(--bg); }

  /* ── SIDEBAR ── */
  .db-sidebar {
    width: var(--sidebar-w);
    background: var(--navy);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    padding: 0;
  }
  .db-sidebar-logo {
    padding: 24px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .db-logo-icon {
    width: 34px; height: 34px;
    background: var(--yellow);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .db-logo-text { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .db-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 500; margin-top: 1px; }
  .db-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
  .db-nav-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 12px 0 6px; }
  .db-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    font-size: 13.5px; font-weight: 600;
    color: rgba(255,255,255,0.55);
    cursor: pointer; border: none; background: none;
    width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .db-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .db-nav-item.active { background: var(--yellow); color: var(--navy); }
  .db-nav-item.active svg { stroke: var(--navy); }
  .db-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .db-user-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    cursor: pointer; transition: background 0.15s;
    border: none; background: none; width: 100%; text-align: left;
  }
  .db-user-row:hover { background: rgba(255,255,255,0.07); }
  .db-avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: var(--navy); flex-shrink: 0; }
  .db-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .db-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* ── MAIN ── */
  .db-content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── TOPBAR ── */
  .db-topbar {
    background: #fff; border-bottom: 1px solid var(--border);
    padding: 0 32px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .db-topbar-title { font-size: 18px; font-weight: 700; color: var(--text); }
  .db-topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .db-topbar-right { display: flex; align-items: center; gap: 12px; }
  .db-icon-btn {
    width: 38px; height: 38px; border-radius: 8px;
    border: 1px solid var(--border); background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text); transition: all 0.15s; position: relative;
  }
  .db-icon-btn:hover { background: var(--bg); }
  .db-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 1.5px solid #fff; }

  /* ── PAGE BODY ── */
  .db-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 28px; }

  /* ── KPI CARDS ── */
  .db-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .db-kpi-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px 20px 16px;
    cursor: pointer; transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .db-kpi-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--yellow); transform: scaleX(0); transform-origin: left; transition: transform 0.2s;
  }
  .db-kpi-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .db-kpi-card:hover::before { transform: scaleX(1); }
  .db-kpi-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
  .db-kpi-icon { width: 42px; height: 42px; background: rgba(1,35,63,0.07); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--navy); }
  .db-kpi-change { font-size: 11px; font-weight: 600; color: var(--green); background: rgba(34,197,94,0.1); padding: 3px 8px; border-radius: 20px; }
  .db-kpi-value { font-size: 32px; font-weight: 800; color: var(--text); line-height: 1; font-family: 'DM Mono', monospace; letter-spacing: -1px; }
  .db-kpi-label { font-size: 12px; color: var(--muted); font-weight: 500; margin-top: 4px; }

  /* ── MID ROW ── */
  .db-mid-row { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }

  /* ── CHART CARD ── */
  .db-chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .db-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .db-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .db-card-badge { font-size: 11px; font-weight: 600; color: var(--muted); background: var(--bg); padding: 4px 10px; border-radius: 20px; }

  /* ── OCCUPANCY ── */
  .db-occup-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .db-occup-list { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
  .db-occup-row { display: flex; flex-direction: column; gap: 6px; }
  .db-occup-meta { display: flex; justify-content: space-between; align-items: center; }
  .db-occup-rota { font-size: 12px; font-weight: 600; color: var(--text); }
  .db-occup-pct { font-size: 12px; font-weight: 700; font-family: 'DM Mono', monospace; color: var(--navy); }
  .db-occup-bar { height: 6px; background: #eef0f3; border-radius: 99px; overflow: hidden; }
  .db-occup-fill { height: 100%; border-radius: 99px; background: var(--navy); transition: width 0.6s ease; }
  .db-occup-fill.high { background: var(--red); }
  .db-occup-fill.mid  { background: var(--yellow); }

  /* ── BOTTOM ROW ── */
  .db-bottom-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* ── METRIC CARDS ── */
  .db-metric-new { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
  .db-metric-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .db-metric-header { display: flex; align-items: center; gap: 8px; }
  .db-metric-lbl { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
  .db-metric-val { font-size: 28px; font-weight: 800; color: var(--text); font-family: 'DM Mono', monospace; letter-spacing: -1px; margin-top: 4px; }
  .db-metric-desc { font-size: 11px; color: var(--muted); }

  /* ── ACTIVITY FEED ── */
  .db-activity-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .db-activity-list { display: flex; flex-direction: column; gap: 0; margin-top: 4px; }
  .db-activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .db-activity-item:last-child { border-bottom: none; }
  .db-act-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .db-act-text { font-size: 12.5px; color: var(--text); font-weight: 500; line-height: 1.4; flex: 1; }
  .db-act-meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
  .db-act-time { font-size: 11px; color: var(--muted); }
  .db-act-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── BTN ── */
  .db-btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--yellow); border: none; border-radius: 8px;
    padding: 10px 18px; font-size: 13px; font-weight: 700;
    color: var(--navy); cursor: pointer; transition: background 0.15s;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px;
  }
  .db-btn-primary:hover { background: var(--yellow-dark); }

  @media (max-width: 1200px) {
    .db-kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .db-bottom-row { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 900px) {
    .db-mid-row { grid-template-columns: 1fr; }
    .db-bottom-row { grid-template-columns: 1fr; }
    :root { --sidebar-w: 0px; }
    .db-sidebar { display: none; }
  }
`;

// ─── Tooltip do gráfico ───────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#01233F", color: "#fff", fontSize: 12, padding: "8px 12px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <p style={{ fontWeight: 700, marginBottom: 2 }}>{label}</p>
        <p>R$ {payload[0].value.toLocaleString("pt-BR")}</p>
      </div>
    );
  }
  return null;
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function formatMetricValue(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function getCurrentPeriod() {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: String(now.getFullYear()),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { expenses, fetchExpenses } = useExpenses(false);
  const { getLimitByPeriod } = useSpendingLimits(false);
  const [currentMonthLimit, setCurrentMonthLimit] = useState(0);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    fetchExpenses({ per_page: 1000 });
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setCurrentMonthLimit(0);
      return;
    }

    const { month, year } = getCurrentPeriod();
    getLimitByPeriod(user.id, year, month)
      .then((limit) => {
        if (!limit) {
          setCurrentMonthLimit(0);
          return;
        }
        setCurrentMonthLimit(parseNumber((limit as any).limit_amount ?? (limit as any).limit_value));
      })
      .catch(() => setCurrentMonthLimit(0));
  }, [user?.id]);

  const { currentMonthExpenses, minMonthExpenses } = useMemo(() => {
    const { month, year } = getCurrentPeriod();
    const monthlyTotals = new Map<string, number>();

    for (const expense of expenses ?? []) {
      const expenseDate = expense?.created_at ? new Date(expense.created_at) : null;
      if (!expenseDate || Number.isNaN(expenseDate.getTime())) continue;

      const expenseMonth = String(expenseDate.getMonth() + 1).padStart(2, "0");
      const expenseYear = String(expenseDate.getFullYear());
      const key = `${expenseYear}-${expenseMonth}`;

      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + parseNumber((expense as any).value));
    }

    const currentKey = `${year}-${month}`;
    const currentMonthTotal = monthlyTotals.get(currentKey) ?? 0;
    const totals = Array.from(monthlyTotals.values());

    return {
      currentMonthExpenses: currentMonthTotal,
      minMonthExpenses: totals.length > 0 ? Math.min(...totals) : 0,
    };
  }, [expenses]);

  const dynamicFinancialMetrics = [
    { label: "META DE GASTOS",       value: `R$ ${formatMetricValue(currentMonthLimit)}`,    sub: "por mês",      color: "#01233F" },
    { label: "GASTOS DO MÊS ATUAL",  value: `R$ ${formatMetricValue(currentMonthExpenses)}`, sub: "em andamento", color: "#f1bb13" },
    { label: "MÊS COM MENOS GASTOS", value: `R$ ${formatMetricValue(minMonthExpenses)}`,     sub: "por mês",      color: "#22c55e" },
  ];

  const handleCardClick = (id: string) => {
    const routes: Record<string, string> = {
      buses: "/lista_onibus", routes: "/lista_rotas",
      drivers: "/lista_motoristas", students: "/lista_alunos",
    };
    if (routes[id]) router.push(routes[id]);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="db-layout">

        {/* ── SIDEBAR ── */}
        <aside className="db-sidebar">
          <div className="db-sidebar-logo">
            <div className="db-logo-icon">
              <BusIcon size={18} color="#01233F" />
            </div>
            <div>
              <div className="db-logo-text">Omnibus</div>
              <div className="db-logo-sub">Gestão Escolar</div>
            </div>
          </div>

          <nav className="db-nav">
            <span className="db-nav-label">Principal</span>
            <button
              className={`db-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
              onClick={() => { setActiveNav("dashboard"); router.push("/dashboard"); }}
            >
              <DashIcon /> Dashboard
            </button>
            <button
              className={`db-nav-item ${activeNav === "financeiro" ? "active" : ""}`}
              onClick={() => { setActiveNav("financeiro"); router.push("/financeiro"); }}
            >
              <FinanceIcon /> Financeiro
            </button>

            <span className="db-nav-label">Cadastros</span>
            <button className="db-nav-item" onClick={() => router.push("/lista_onibus")}>
              <BusIcon size={18} /> Ônibus
            </button>
            <button className="db-nav-item" onClick={() => router.push("/lista_rotas")}>
              <RouteIcon size={18} /> Rotas
            </button>
            <button className="db-nav-item" onClick={() => router.push("/lista_motoristas")}>
              <DriverIcon size={18} /> Motoristas
            </button>
            <button className="db-nav-item" onClick={() => router.push("/lista_alunos")}>
              <StudentIcon size={18} /> Alunos
            </button>
          </nav>

          <div className="db-sidebar-footer">
            <button className="db-user-row" onClick={() => router.push("/infor_instituicao")}>
              <div className="db-avatar">A</div>
              <div>
                <div className="db-user-name">Admin</div>
                <div className="db-user-role">Gestor</div>
              </div>
            </button>
          </div>
        </aside>

        {/* ── CONTENT ── */}
        <div className="db-content">

          {/* TOPBAR */}
          <header className="db-topbar">
            <div>
              <div className="db-topbar-title">Dashboard</div>
              <div className="db-topbar-sub">
                Visão geral do sistema · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="db-topbar-right">
              <button className="db-icon-btn" onClick={() => router.push("/notifications")} title="Notificações">
                <BellIcon />
                <span className="db-notif-dot" />
              </button>
              <button className="db-icon-btn" onClick={() => router.push("/infor_instituicao")} title="Perfil">
                <UserIcon />
              </button>
            </div>
          </header>

          {/* BODY */}
          <div className="db-body">

            {/* KPI CARDS */}
            <div className="db-kpi-grid">
              {systemStatus.map((s) => {
                const Icon = ICON_MAP[s.icon];
                return (
                  <div key={s.id} className="db-kpi-card" onClick={() => handleCardClick(s.id)}>
                    <div className="db-kpi-top">
                      <div className="db-kpi-icon"><Icon size={22} color="#01233F" /></div>
                      <span className="db-kpi-change">{s.change}</span>
                    </div>
                    <div className="db-kpi-value">{s.value.toLocaleString("pt-BR")}</div>
                    <div className="db-kpi-label">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* MID ROW: Chart + Occupancy */}
            <div className="db-mid-row">

              {/* Chart */}
              <div className="db-chart-card">
                <div className="db-card-header">
                  <span className="db-card-title">Gráfico de Gastos</span>
                  <span className="db-card-badge">2025</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#01233F" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#01233F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="valor" stroke="#01233F" strokeWidth={2.5}
                      fill="url(#colorValor)"
                      dot={{ r: 3, fill: "#01233F", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#f1bb13", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Occupancy */}
              <div className="db-occup-card">
                <div className="db-card-header">
                  <span className="db-card-title">Ocupação por Rota</span>
                </div>
                <div className="db-occup-list">
                  {occupancyData.map((o) => (
                    <div key={o.rota} className="db-occup-row">
                      <div className="db-occup-meta">
                        <span className="db-occup-rota">Rota {o.rota}</span>
                        <span className="db-occup-pct">{o.ocupacao}%</span>
                      </div>
                      <div className="db-occup-bar">
                        <div
                          className={`db-occup-fill ${o.ocupacao >= 90 ? "high" : o.ocupacao >= 70 ? "mid" : ""}`}
                          style={{ width: `${o.ocupacao}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: Métricas + Atividade */}
            <div className="db-bottom-row">

              {/* Métricas financeiras dinâmicas */}
              {dynamicFinancialMetrics.map((m) => (
                <div key={m.label} className="db-metric-new">
                  <div className="db-metric-header">
                    <div className="db-metric-dot" style={{ background: m.color }} />
                    <span className="db-metric-lbl">{m.label}</span>
                  </div>
                  <div className="db-metric-val">{m.value}</div>
                  <div className="db-metric-desc">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* ATIVIDADE RECENTE */}
            <div className="db-activity-card">
              <div className="db-card-header">
                <span className="db-card-title">Atividade Recente</span>
                <button className="db-btn-primary" onClick={() => router.push("/visualizar_gastos")}>
                  Visualizar Gastos
                </button>
              </div>
              <div className="db-activity-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="db-activity-item">
                    <div className="db-act-dot" style={{ background: STATUS_COLORS[a.status] }} />
                    <div style={{ flex: 1 }}>
                      <div className="db-act-text">{a.text}</div>
                      <div className="db-act-meta">
                        <span className="db-act-time">{a.time}</span>
                        <span
                          className="db-act-badge"
                          style={{
                            background: STATUS_COLORS[a.status] + "20",
                            color: STATUS_COLORS[a.status],
                          }}
                        >
                          {STATUS_LABELS[a.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}