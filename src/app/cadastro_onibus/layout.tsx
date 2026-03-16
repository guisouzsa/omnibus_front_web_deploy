'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function CadastroOnibusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
