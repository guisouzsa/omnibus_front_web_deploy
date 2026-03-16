"use client";

import { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useDrivers } from "@/hooks";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function EditarMotorista() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverId = searchParams.get('id');
  const { getDriver, updateDriver, loading } = useDrivers(false);

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    email: "",
    license_number: "",
    password: "",
    password_confirmation: "",
  });
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Carregar dados do motorista
  useEffect(() => {
    if (driverId) {
      loadDriver();
    } else {
      setErrorMessage("ID do motorista não encontrado");
      setLoadingDriver(false);
    }
  }, [driverId]);

  const loadDriver = async () => {
    try {
      const driver = await getDriver(Number(driverId));
      setForm({
        name: driver.name,
        phone_number: driver.phone_number,
        email: driver.email,
        license_number: driver.license_number,
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao carregar motorista");
    } finally {
      setLoadingDriver(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Se preencher senha, validar
    if (form.password) {
      if (form.password !== form.password_confirmation) {
        setErrorMessage("As senhas não coincidem");
        return;
      }
      if (form.password.length < 8) {
        setErrorMessage("A senha deve ter pelo menos 8 caracteres");
        return;
      }
    }

    try {
      // Preparar dados (remover senha se estiver vazia)
      const updateData: any = {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        license_number: form.license_number,
      };

      if (form.password) {
        updateData.password = form.password;
        updateData.password_confirmation = form.password_confirmation;
      }

      await updateDriver(Number(driverId), updateData);
      
      setSuccessMessage("Motorista atualizado com sucesso!");
      
      setTimeout(() => {
        router.push("/lista_motoristas");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao atualizar motorista");
    }
  };

  if (loadingDriver) {
    return (
      <main className={montserrat.className} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main
      className={montserrat.className}
      style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}
    >
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-link {
          font-size: 14px;
          font-weight: 700;
          color: #1a2b6d;
          letter-spacing: 0.05em;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }

        .nav-link:hover {
          opacity: 0.7;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notif-icon-btn {
          color: #1a2b6d;
        }

        .user-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a2b6d;
        }
      `}</style>

      {/* NAVBAR */}
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

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1a2b6d",
            letterSpacing: "0.06em",
            marginBottom: "28px",
          }}
        >
          EDITAR MOTORISTA
        </h1>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "32px 32px 36px",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {[
              { label: "NOME",        name: "name",    type: "text" },
              { label: "EMAIL",       name: "email",    type: "email" },
              { label: "TELEFONE",    name: "phone_number",    type: "text" },
              { label: "NÚMERO DA CNH", name: "license_number",   type: "text" },
              { label: "NOVA SENHA (opcional)", name: "password", type: "password" },
              { label: "CONFIRMAR SENHA", name: "password_confirmation", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#1a2b6d", letterSpacing: "0.07em" }}>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={name.includes('password') ? 'Deixe em branco para manter a senha atual' : ''}
                  style={{
                    background: "#f5f5f5",
                    border: "none",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "#333",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #f5a623")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
            ))}

            {errorMessage && (
              <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '6px', color: '#c33', padding: '12px', fontSize: '13px' }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ background: '#efe', border: '1px solid #cfc', borderRadius: '6px', color: '#3c3', padding: '12px', fontSize: '13px' }}>
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#ccc" : "#f5a623",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                padding: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "4px",
                transition: "background 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.background = "#e09510")}
              onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.background = "#f5a623")}
            >
              {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}