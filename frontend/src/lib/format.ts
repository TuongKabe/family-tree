/**
 * @project AncestorTree
 * @file src/lib/format.ts
 * @description Shared formatting utilities
 * @version 1.0.0
 * @updated 2026-02-25
 */

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
