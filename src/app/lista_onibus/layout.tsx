'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ListaOnibusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
