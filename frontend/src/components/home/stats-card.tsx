/**
 * @project AncestorTree
 * @file src/components/home/stats-card.tsx
 * @description Homepage stats card with live data
 * @version 1.0.0
 * @updated 2026-02-24
 */

'use client';

import { useStats } from '@/hooks/use-people';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsCard() {
  const { data: stats, isLoading } = useStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Thống kê</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-16 mx-auto mb-1" />
            ) : (
              <div className="text-3xl font-bold text-emerald-600">
                {stats?.totalPeople || 0}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Thành viên</div>
          </div>
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <div className="text-3xl font-bold text-emerald-600">
                {stats?.totalGenerations || 0}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Thế hệ</div>
          </div>
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <div className="text-3xl font-bold text-emerald-600">
                {stats?.totalChi || 0}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Chi/Nhánh</div>
          </div>
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mb-1" />
            ) : (
              <div className="text-3xl font-bold text-amber-600">
                {stats?.livingCount || 0}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Còn sống</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
