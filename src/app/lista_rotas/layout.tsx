'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ListaRotasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
