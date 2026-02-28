/**
 * @project AncestorTree
 * @file src/hooks/use-events.ts
 * @description React Query hooks for events data
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEvents,
  getEvent,
  getEventsByType,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/lib/supabase-data';
import type { Event, EventType } from '@/types';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  byType: (type: EventType) => [...eventKeys.all, 'type', type] as const,
};

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: getEvents,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(id!),
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });
}

export function useEventsByType(type: EventType) {
  return useQuery({
    queryKey: eventKeys.byType(type),
    queryFn: () => getEventsByType(type),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<Event, 'id' | 'created_at'>) => createEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Omit<Event, 'id' | 'created_at'>> }) =>
      updateEvent(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
