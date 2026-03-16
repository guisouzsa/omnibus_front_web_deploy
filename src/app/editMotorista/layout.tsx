'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditMotoristaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
