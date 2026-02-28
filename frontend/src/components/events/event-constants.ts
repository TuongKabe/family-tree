/**
 * @project AncestorTree
 * @file src/components/events/event-constants.ts
 * @description Shared constants for event components
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { Flame, Users, PartyPopper, CalendarDays } from 'lucide-react';
import type { EventType } from '@/types';

export const EVENT_TYPE_LABELS: Record<EventType, { label: string; icon: typeof Flame; color: string }> = {
  gio: { label: 'Ngày giỗ', icon: Flame, color: 'text-red-600 bg-red-50' },
  hop_ho: { label: 'Họp họ', icon: Users, color: 'text-blue-600 bg-blue-50' },
  le_tet: { label: 'Lễ tết', icon: PartyPopper, color: 'text-amber-600 bg-amber-50' },
  other: { label: 'Khác', icon: CalendarDays, color: 'text-gray-600 bg-gray-50' },
};

export const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];
