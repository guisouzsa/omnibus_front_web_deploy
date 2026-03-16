'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditOnibusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
