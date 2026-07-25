import { useCallback, useState } from 'react';
import type { MediaItem } from '@/types';

// 读取文件为 Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 生成视频缩略图
function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadeddata = () => {
      video.currentTime = 1;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      }
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      video.remove();
      resolve('');
    };
  });
}

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(async (files: FileList | File[]): Promise<MediaItem[]> => {
    setUploading(true);
    const results: MediaItem[] = [];

    for (const file of Array.from(files)) {
      try {
        const url = await fileToBase64(file);
        if (file.type.startsWith('video/')) {
          const thumbnail = await generateVideoThumbnail(file);
          results.push({ type: 'video', url, thumbnail });
        } else {
          results.push({ type: 'image', url });
        }
      } catch {
        // 跳过失败的文件
      }
    }

    setUploading(false);
    return results;
  }, []);

  return { uploadFiles, uploading };
}