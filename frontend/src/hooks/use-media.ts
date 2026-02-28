/**
 * @project AncestorTree
 * @file src/hooks/use-media.ts
 * @description React Query hooks for media operations
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMediaByPerson,
  createMedia,
  deleteMedia as deleteMediaRecord,
  setPrimaryMedia,
} from '@/lib/supabase-data';
import { uploadFile, deleteFile } from '@/lib/supabase-storage';
import type { CreateMediaInput } from '@/types';

export const mediaKeys = {
  all: ['media'] as const,
  byPerson: (personId: string) => [...mediaKeys.all, 'person', personId] as const,
};

export function usePersonMedia(personId: string | undefined) {
  return useQuery({
    queryKey: mediaKeys.byPerson(personId!),
    queryFn: () => getMediaByPerson(personId!),
    enabled: !!personId,
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, personId, caption }: {
      file: File;
      personId: string;
      caption?: string;
    }) => {
      const url = await uploadFile(file, personId);
      const input: CreateMediaInput = {
        person_id: personId,
        type: 'photo',
        url,
        caption,
        is_primary: false,
        sort_order: 0,
      };
      return createMedia(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.byPerson(data.person_id) });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, url, personId }: {
      id: string;
      url: string;
      personId: string;
    }) => {
      // Delete DB record first to avoid orphaned records if storage delete fails
      await deleteMediaRecord(id);
      await deleteFile(url);
      return personId;
    },
    onSuccess: (personId) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.byPerson(personId) });
    },
  });
}

export function useSetPrimaryMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, mediaId }: { personId: string; mediaId: string }) =>
      setPrimaryMedia(personId, mediaId),
    onSuccess: (_, { personId }) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.byPerson(personId) });
    },
  });
}
