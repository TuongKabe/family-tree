/**
 * @project AncestorTree
 * @file src/app/(main)/charter/loading.tsx
 * @description Loading skeleton for charter page
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function CharterLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
