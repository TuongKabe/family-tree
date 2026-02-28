/**
 * @project AncestorTree
 * @file src/app/(main)/cau-duong/loading.tsx
 * @description Loading skeleton for cau-duong page
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function CauDuongLoading() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-16 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
