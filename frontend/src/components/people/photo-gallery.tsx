/**
 * @project AncestorTree
 * @file src/components/people/photo-gallery.tsx
 * @description Photo gallery component for person detail page
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { usePersonMedia, useUploadMedia, useDeleteMedia, useSetPrimaryMedia } from '@/hooks/use-media';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ImagePlus, Trash2, Star, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Media } from '@/types';

interface PhotoGalleryProps {
  personId: string;
  canEdit: boolean;
}

export function PhotoGallery({ personId, canEdit }: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);

  const { data: photos, isLoading } = usePersonMedia(personId);
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();
  const setPrimaryMutation = useSetPrimaryMedia();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadMutation.mutateAsync({ file, personId });
      toast.success('Tải ảnh lên thành công');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tải ảnh lên');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (photo: Media) => {
    try {
      await deleteMutation.mutateAsync({
        id: photo.id,
        url: photo.url,
        personId: photo.person_id,
      });
      setSelectedPhoto(null);
      toast.success('Đã xóa ảnh');
    } catch {
      toast.error('Lỗi khi xóa ảnh');
    }
  };

  const handleSetPrimary = async (photo: Media) => {
    try {
      await setPrimaryMutation.mutateAsync({
        personId: photo.person_id,
        mediaId: photo.id,
      });
      toast.success('Đã đặt làm ảnh chính');
    } catch {
      toast.error('Lỗi khi đặt ảnh chính');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hình ảnh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Hình ảnh</CardTitle>
          {canEdit && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4 mr-2" />
                )}
                Thêm ảnh
              </Button>
            </>
          )}
        </CardHeader>
        <CardContent>
          {!photos || photos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Chưa có hình ảnh</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer border"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Ảnh'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    unoptimized
                  />
                  {photo.is_primary && (
                    <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Chính
                    </Badge>
                  )}
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo preview dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.caption || 'Xem ảnh'}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Ảnh'}
                width={800}
                height={600}
                className="w-full rounded-lg"
                unoptimized
              />
              {canEdit && (
                <div className="flex gap-2 justify-end">
                  {!selectedPhoto.is_primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(selectedPhoto)}
                      disabled={setPrimaryMutation.isPending}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Đặt làm ảnh chính
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa ảnh này?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(selectedPhoto)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
