/**
 * @project AncestorTree
 * @file src/app/(main)/admin/page.tsx
 * @description Admin dashboard with overview stats and quick actions
 * @version 1.0.0
 * @updated 2026-02-24
 */

'use client';

import { useStats } from '@/hooks/use-people';
import { useFamilies } from '@/hooks/use-families';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  GitBranchPlus,
  Heart,
  UserPlus,
  Settings,
  Shield,
  Activity,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: families, isLoading: familiesLoading } = useFamilies();

  const isLoading = statsLoading || familiesLoading;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Quản trị hệ thống
          </h1>
          <p className="text-muted-foreground">
            Tổng quan và quản lý dữ liệu gia phả
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/settings">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tổng thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalPeople || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Số đời
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalGenerations || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GitBranchPlus className="h-4 w-4" />
              Số chi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalChi || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Gia đình
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{families?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thao tác nhanh</CardTitle>
            <CardDescription>Các tác vụ quản trị thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/people/new">
                <UserPlus className="h-5 w-5 mb-2" />
                <span>Thêm thành viên</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/users">
                <Users className="h-5 w-5 mb-2" />
                <span>Quản lý users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/tree">
                <GitBranchPlus className="h-5 w-5 mb-2" />
                <span>Xem cây phả hệ</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/people">
                <Activity className="h-5 w-5 mb-2" />
                <span>Danh sách</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thống kê chi tiết</CardTitle>
            <CardDescription>Phân bố thành viên</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Còn sống</span>
              {isLoading ? (
                <Skeleton className="h-5 w-12" />
              ) : (
                <span className="font-semibold text-green-600">{stats?.livingCount || 0}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Đã mất</span>
              {isLoading ? (
                <Skeleton className="h-5 w-12" />
              ) : (
                <span className="font-semibold text-gray-500">{stats?.deceasedCount || 0}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gia đình</span>
              {isLoading ? (
                <Skeleton className="h-5 w-12" />
              ) : (
                <span className="font-semibold">{families?.length || 0}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
          <CardDescription>Các thay đổi mới nhất trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Tính năng đang phát triển</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
