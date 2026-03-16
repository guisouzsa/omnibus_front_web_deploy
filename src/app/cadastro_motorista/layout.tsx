'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function CadastroMotoristaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
