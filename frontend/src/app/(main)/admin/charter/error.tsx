/**
 * @project AncestorTree
 * @file src/app/(main)/admin/charter/error.tsx
 * @description Error boundary for admin charter page
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { RouteError } from '@/components/shared/route-error';

export default function AdminCharterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} title="Lỗi tải trang quản lý hương ước" />;
}
