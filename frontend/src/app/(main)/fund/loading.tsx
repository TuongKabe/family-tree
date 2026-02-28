/**
 * @project AncestorTree
 * @file src/app/(main)/fund/loading.tsx
 * @description Loading skeleton for fund page
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function FundLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
