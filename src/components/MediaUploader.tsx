import { useRef } from 'react';
import { Image, Video, X } from 'lucide-react';
import type { MediaItem } from '@/types';

interface Props {
  media: MediaItem[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
  maxCount?: number;
}

export default function MediaUploader({ media, onAdd, onRemove, maxCount = 9 }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={media.length >= maxCount}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border text-[#666] hover:border-[#FF6B9D] hover:text-[#FF6B9D] transition-colors disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Image size={16} />
          添加图片
        </button>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          disabled={media.length >= maxCount}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border text-[#666] hover:border-[#FF6B9D] hover:text-[#FF6B9D] transition-colors disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Video size={16} />
          添加视频
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              onAdd(e.target.files);
              e.target.value = '';
            }
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              onAdd(e.target.files);
              e.target.value = '';
            }
          }}
        />
      </div>

      {media.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {media.map((item, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Video size={20} className="text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}