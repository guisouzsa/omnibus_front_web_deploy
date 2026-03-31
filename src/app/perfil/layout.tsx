'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function InforInstituicaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
