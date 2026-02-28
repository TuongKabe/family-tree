/**
 * @project AncestorTree
 * @file src/app/(main)/documents/loading.tsx
 * @description Loading skeleton for documents page
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
