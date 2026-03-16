# Integração com API Laravel - Omnibus Front

Este projeto Next.js está integrado com a API Laravel localizada em `C:\projetos\Omnibus`.

## 📋 Índice

- [Configuração Inicial](#configuração-inicial)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Uso dos Hooks](#uso-dos-hooks)
- [Exemplos Práticos](#exemplos-práticos)
- [Tratamento de Erros](#tratamento-de-erros)

---

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

O arquivo `.env.local` já está configurado com:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

⚠️ **Importante**: Certifique-se de que o backend Laravel está rodando em `http://localhost:8000`

### 2. Iniciar o Backend

No terminal do backend Laravel:
```bash
cd C:\projetos\Omnibus
php artisan serve
```

### 3. Iniciar o Frontend

No terminal deste projeto:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
src/
├── types/
│   └── api.ts                 # Tipos TypeScript da API
├── lib/
│   └── api-client.ts          # Cliente HTTP base
├── services/
│   ├── auth.service.ts        # Serviço de autenticação
│   ├── drivers.service.ts     # Serviço de motoristas
│   ├── expenses.service.ts    # Serviço de despesas
│   ├── spending-limits.service.ts  # Serviço de limites
│   └── index.ts               # Exportações
└── hooks/
    ├── useAuth.ts             # Hook de autenticação (secretaria)
    ├── useDriverAuth.ts       # Hook de autenticação (motorista)
    ├── useDrivers.ts          # Hook de motoristas
    ├── useExpenses.ts         # Hook de despesas
    ├── useSpendingLimits.ts   # Hook de limites
    └── index.ts               # Exportações
```

---

## 🔐 Autenticação

### Sistema Dual de Autenticação

O sistema possui dois tipos de usuários:

1. **Secretaria (Web)** - Usa o modelo `User`
2. **Motoristas (App Mobile)** - Usa o modelo `Drivers`

### Token Storage

Os tokens são armazenados no `localStorage` e automaticamente incluídos nas requisições.

---

## 🎣 Uso dos Hooks

### 1. Hook de Autenticação (Secretaria)

```tsx
'use client';

import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await login(
        formData.get('email') as string,
        formData.get('password') as string
      );
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <form onSubmit={handleLogin}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Senha" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### 2. Hook de Autenticação (Motorista)

```tsx
'use client';

import { useDriverAuth } from '@/hooks';

export default function DriverLoginPage() {
  const { login, driver, loading, error } = useDriverAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirecionar para dashboard do motorista
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    // Seu componente de login
  );
}
```

### 3. Hook de Motoristas

```tsx
'use client';

import { useDrivers } from '@/hooks';

export default function DriversListPage() {
  const {
    drivers,
    loading,
    error,
    pagination,
    createDriver,
    updateDriver,
    deleteDriver,
  } = useDrivers();

  const handleCreate = async () => {
    try {
      await createDriver({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        password_confirmation: 'senha123',
        license_number: '12345678900',
        phone_number: '11999999999',
      });
    } catch (err) {
      console.error('Erro ao criar motorista:', err);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Motoristas</h1>
      <button onClick={handleCreate}>Novo Motorista</button>
      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>
            {driver.name} - {driver.email}
            <button onClick={() => deleteDriver(driver.id)}>
              Deletar
            </button>
          </li>
        ))}
      </ul>
      <p>
        Página {pagination.currentPage} de {pagination.lastPage}
      </p>
    </div>
  );
}
```

### 4. Hook de Despesas

```tsx
'use client';

import { useExpenses } from '@/hooks';

export default function ExpensesPage() {
  const {
    expenses,
    loading,
    error,
    createExpense,
    approveExpense,
    rejectExpense,
  } = useExpenses();

  const handleCreateWithFile = async (
    vehiclePlate: string,
    value: number,
    file: File
  ) => {
    try {
      await createExpense(
        { vehicle_plate: vehiclePlate, value },
        file
      );
    } catch (err) {
      console.error('Erro ao criar despesa:', err);
    }
  };

  return (
    <div>
      <h1>Despesas</h1>
      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>Placa: {expense.vehicle_plate}</p>
          <p>Valor: R$ {expense.value}</p>
          <p>Status: {expense.status}</p>
          <button onClick={() => approveExpense(expense.id)}>
            Aprovar
          </button>
          <button onClick={() => rejectExpense(expense.id)}>
            Rejeitar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 5. Hook do Motorista para Despesas

```tsx
'use client';

import { useExpenses } from '@/hooks';

export default function DriverExpensesPage() {
  const {
    expenses,
    loading,
    createExpenseAsDriver,
    getMonthlyTotal,
  } = useExpenses(false); // false = não busca automaticamente

  useEffect(() => {
    fetchMyExpenses();
  }, []);

  const handleSubmit = async (
    vehiclePlate: string,
    value: number,
    file: File
  ) => {
    try {
      await createExpenseAsDriver(
        { vehicle_plate: vehiclePlate, value },
        file
      );
      alert('Despesa cadastrada com sucesso!');
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    // Seu componente
  );
}
```

### 6. Hook de Limites de Gastos

```tsx
'use client';

import { useSpendingLimits } from '@/hooks';

export default function SpendingLimitsPage() {
  const {
    limits,
    loading,
    createLimit,
    checkExceeded,
  } = useSpendingLimits();

  const handleCreate = async (userId: number) => {
    try {
      await createLimit({
        user_id: userId,
        month: '03',
        year: '2026',
        limit_value: 5000,
      });
    } catch (err) {
      console.error('Erro ao criar limite:', err);
    }
  };

  const handleCheckLimit = async (userId: number) => {
    try {
      const result = await checkExceeded(userId, '2026', '03');
      if (result.exceeded) {
        alert('Limite excedido!');
      }
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    // Seu componente
  );
}
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Página de Registro

```tsx
'use client';

import { useAuth } from '@/hooks';
import { useState } from 'react';

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Usuário registrado com sucesso!');
    } catch (err) {
      console.error('Erro ao registrar:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        type="password"
        placeholder="Confirmar Senha"
        value={formData.password_confirmation}
        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Exemplo 2: Upload de Comprovante

```tsx
'use client';

import { useExpenses } from '@/hooks';
import { useState } from 'react';

export default function NewExpensePage() {
  const { createExpenseAsDriver, loading } = useExpenses(false);
  const [file, setFile] = useState<File | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('Selecione um comprovante');
      return;
    }

    try {
      await createExpenseAsDriver(
        {
          vehicle_plate: vehiclePlate,
          value: parseFloat(value),
        },
        file
      );
      alert('Despesa cadastrada com sucesso!');
      // Limpar formulário
      setVehiclePlate('');
      setValue('');
      setFile(null);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Placa do Veículo"
        value={vehiclePlate}
        onChange={(e) => setVehiclePlate(e.target.value)}
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Valor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Cadastrar Despesa'}
      </button>
    </form>
  );
}
```

---

## ⚠️ Tratamento de Erros

Todos os hooks retornam um estado `error` que contém a mensagem de erro:

```tsx
const { error } = useAuth();

if (error) {
  return <div className="alert alert-danger">{error}</div>;
}
```

### Erros de Validação

Erros de validação da API Laravel são capturados e podem ser acessados:

```tsx
try {
  await createDriver(data);
} catch (err: any) {
  if (err.response?.errors) {
    // err.response.errors contém os erros de validação
    console.log(err.response.errors);
  }
}
```

---

## 🔄 Redirecionamento Automático

O cliente HTTP redireciona automaticamente para `/login` quando:
- O token expira (erro 401)
- O usuário não está autenticado

---

## 📝 Notas Importantes

1. **CORS**: O backend já está configurado para aceitar requisições do frontend
2. **Credenciais**: As requisições incluem `credentials: 'include'` para cookies
3. **Tokens**: Tokens são salvos automaticamente no `localStorage`
4. **Logout**: Sempre use os métodos de logout dos hooks para limpar o token

---

## 🚀 Próximos Passos

1. Implemente as páginas usando os hooks fornecidos
2. Adicione validação de formulários
3. Implemente feedback visual (toasts, alerts)
4. Adicione loading states nos componentes
5. Configure proteção de rotas (middleware)

---

## 📚 Recursos Adicionais

- Documentação da API: `C:\projetos\Omnibus\API_DOCS.md`
- Laravel Sanctum: https://laravel.com/docs/sanctum
- Next.js: https://nextjs.org/docs
