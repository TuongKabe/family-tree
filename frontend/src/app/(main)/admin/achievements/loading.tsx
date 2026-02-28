/**
 * @project AncestorTree
 * @file src/app/(main)/admin/achievements/loading.tsx
 * @description Loading skeleton for admin achievements page
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAchievementsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-64" />
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
