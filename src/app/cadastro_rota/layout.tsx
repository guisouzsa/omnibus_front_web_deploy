'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function CadastroRotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
