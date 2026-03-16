'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ListaMotoristasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
