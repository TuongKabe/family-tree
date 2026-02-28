/**
 * @project AncestorTree
 * @file src/lib/supabase-storage.ts
 * @description Supabase Storage utilities for file upload/delete
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { supabase } from './supabase';

const BUCKET_NAME = 'media';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function uploadFile(file: File, personId: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new StorageError('File quá lớn. Tối đa 5MB.');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new StorageError('Định dạng không hỗ trợ. Chấp nhận: JPEG, PNG, WebP, GIF.');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const path = `people/${personId}/${timestamp}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new StorageError(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  // Extract path from public URL
  const bucketUrl = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const idx = url.indexOf(bucketUrl);
  if (idx === -1) {
    console.warn(`[Storage] Cannot parse storage path from URL: ${url}`);
    return;
  }

  const path = decodeURIComponent(url.slice(idx + bucketUrl.length));
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw new StorageError(error.message);
}
