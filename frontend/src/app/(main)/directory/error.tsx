/**
 * @project AncestorTree
 * @file src/app/(main)/directory/error.tsx
 * @description Error boundary for directory page
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function DirectoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lỗi tải danh bạ</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || 'Đã xảy ra lỗi khi tải danh bạ liên lạc.'}
          </p>
          <Button onClick={reset}>Thử lại</Button>
        </CardContent>
      </Card>
    </div>
  );
}
