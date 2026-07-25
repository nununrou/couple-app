import { useState, useRef } from 'react';
import { Plus, MapPin, Trash2, Video, Upload } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useGeolocation } from '@/hooks/useGeolocation';
import { generateId } from '@/utils/id';
import { formatRelative } from '@/utils/date';
import AddModal from '@/components/AddModal';
import MediaUploader from '@/components/MediaUploader';
import LocationPicker from '@/components/LocationPicker';
import MediaPreview from '@/components/MediaPreview';
import EmptyState from '@/components/EmptyState';
import type { MediaItem, Location as LocationType, PhotoItem } from '@/types';

export default function PhotosPage() {
  const { photoItems, addPhotos, deletePhoto } = useAppStore();
  const { uploadFiles, uploading } = useMediaUpload();
  const { getLocation, loading: locLoading, error: locError } = useGeolocation();

  const [showUpload, setShowUpload] = useState(false);
  const [uploadMedia, setUploadMedia] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState<LocationType | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMedia = async (files: FileList) => {
    const newMedia = await uploadFiles(files);
    setUploadMedia((prev) => [...prev, ...newMedia]);
  };

  const handleGetLocation = async () => {
    const loc = await getLocation();
    if (loc) setLocation(loc);
  };

  const handleUpload = () => {
    if (uploadMedia.length === 0) return;

    const newItems: PhotoItem[] = uploadMedia.map((m) => ({
      id: generateId(),
      title: title.trim() || '未命名',
      createdAt: new Date().toISOString(),
      media: [m],
      location,
    }));

    addPhotos(newItems);
    setUploadMedia([]);
    setTitle('');
    setLocation(null);
    setShowUpload(false);
  };

  const handlePreview = (mediaItems: MediaItem[], index: number) => {
    setPreviewMedia(mediaItems);
    setPreviewIndex(index);
  };

  // 瀑布流分列
  const columns: PhotoItem[][] = [[], []];
  photoItems.forEach((item, i) => {
    columns[i % 2].push(item);
  });

  return (
    <div className="page-container">
      {/* 头部 */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-10 px-5 pt-8 pb-4"
        style={{
          background: 'linear-gradient(180deg, #FFF5F7 60%, rgba(255,245,247,0) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <span className="gradient-text">照片墙</span>
          </h1>
          <button onClick={() => setShowUpload(true)} className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1">
            <Plus size={16} />
            上传
          </button>
        </div>
      </div>

      {/* 瀑布流 */}
      {photoItems.length === 0 ? (
        <EmptyState
          title="还没有照片哦"
          description="上传你们的甜蜜合照吧"
        />
      ) : (
        <div className="flex gap-3">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 space-y-3">
              {col.map((item, i) => (
                <div
                  key={item.id}
                  className="card !p-2 animate-fade-in-up overflow-hidden group"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                >
                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handlePreview(item.media, 0)}
                  >
                    {item.media[0]?.type === 'video' ? (
                      <>
                        <video
                          src={item.media[0].url}
                          className="w-full object-cover"
                          style={{ maxHeight: '280px' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Video size={28} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.media[0]?.url}
                        alt={item.title}
                        className="w-full object-cover"
                        style={{ maxHeight: '320px' }}
                        loading="lazy"
                      />
                    )}

                    {/* Hover遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-bold truncate">{item.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/70 text-xs">
                            {formatRelative(item.createdAt)}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-0.5 text-white/70 text-xs">
                              <MapPin size={10} />
                              {item.location.address}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 标题和删除 */}
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-xs font-medium truncate">{item.title}</span>
                    <button
                      onClick={() => deletePhoto(item.id)}
                      className="text-[#ccc] hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 上传弹窗 */}
      <AddModal title="上传照片/视频" open={showUpload} onClose={() => setShowUpload(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              标题（可选）
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="给这组照片起个名字"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 媒体上传区域 */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              选择文件
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleAddMedia(e.target.files);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-[#FF6B9D] hover:bg-[#FFF5F7]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <Upload size={28} style={{ color: 'var(--color-text-secondary)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                点击选择图片或视频
              </span>
              <span className="text-xs opacity-50">支持批量上传</span>
            </button>
          </div>

          {/* 已选文件预览 */}
          {uploadMedia.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {uploadMedia.map((m, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden">
                  {m.type === 'video' ? (
                    <>
                      <video src={m.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Video size={14} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => setUploadMedia((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs">x</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <LocationPicker
            location={location}
            loading={locLoading}
            error={locError}
            onGetLocation={handleGetLocation}
            onClear={() => setLocation(null)}
          />

          <button
            onClick={handleUpload}
            disabled={uploading || uploadMedia.length === 0}
            className="btn-primary w-full text-sm disabled:opacity-50"
          >
            {uploading ? '上传中...' : `上传 ${uploadMedia.length} 个文件`}
          </button>
        </div>
      </AddModal>

      {/* 媒体预览 */}
      {previewIndex !== null && (
        <MediaPreview
          media={previewMedia}
          initialIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}