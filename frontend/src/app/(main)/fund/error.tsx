/**
 * @project AncestorTree
 * @file src/app/(main)/fund/error.tsx
 * @description Error boundary for fund page
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { RouteError } from '@/components/shared/route-error';

export default function FundError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError error={error} reset={reset} title="Lỗi tải trang quỹ khuyến học" />;
}
