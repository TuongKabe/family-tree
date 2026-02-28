/**
 * @project AncestorTree
 * @file src/components/shared/route-error.tsx
 * @description Reusable error boundary component for route error.tsx files
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  defaultMessage?: string;
}

export function RouteError({ error, reset, title, defaultMessage }: RouteErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || defaultMessage || 'Đã xảy ra lỗi. Vui lòng thử lại.'}
          </p>
          <Button onClick={reset}>Thử lại</Button>
        </CardContent>
      </Card>
    </div>
  );
}
