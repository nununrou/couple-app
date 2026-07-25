import { X } from 'lucide-react';
import type { MediaItem } from '@/types';

interface Props {
  media: MediaItem[];
  initialIndex?: number;
  onClose: () => void;
}

export default function MediaPreview({ media, initialIndex = 0, onClose }: Props) {
  if (!media.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
      >
        <X size={22} className="text-white" />
      </button>

      <div
        className="max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {media[initialIndex]?.type === 'video' ? (
          <video
            src={media[initialIndex].url}
            controls
            className="max-w-full max-h-[85vh] rounded-xl"
            autoPlay
          />
        ) : (
          <img
            src={media[initialIndex]?.url}
            alt=""
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
          />
        )}
      </div>

      {/* 缩略图导航 */}
      {media.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {media.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === initialIndex ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}