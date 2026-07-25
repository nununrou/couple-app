import { useState, useRef } from 'react';
import { Plus, MapPin, ChevronDown, Trash2, Image, Video } from 'lucide-react';
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
import type { MediaItem, Location as LocationType } from '@/types';

export default function TreeholePage() {
  const { settings, treeholeItems, addTreehole, deleteTreehole } = useAppStore();
  const { uploadFiles, uploading } = useMediaUpload();
  const { getLocation, loading: locLoading, error: locError } = useGeolocation();

  const [showAdd, setShowAdd] = useState(false);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [author, setAuthor] = useState<'partnerA' | 'partnerB'>('partnerA');
  const [showAuthorMenu, setShowAuthorMenu] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  const handleAdd = async () => {
    if (!content.trim() && media.length === 0) return;

    addTreehole({
      id: generateId(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      media,
      location,
      author,
    });

    setContent('');
    setMedia([]);
    setLocation(null);
    setShowAdd(false);
  };

  const handleAddMedia = async (files: FileList) => {
    const newMedia = await uploadFiles(files);
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const handleGetLocation = async () => {
    const loc = await getLocation();
    if (loc) setLocation(loc);
  };

  const handlePreview = (mediaItems: MediaItem[], index: number) => {
    setPreviewMedia(mediaItems);
    setPreviewIndex(index);
  };

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
            <span className="gradient-text">树洞</span>
          </h1>
          <button onClick={() => setShowAdd(true)} className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1">
            <Plus size={16} />
            倾诉
          </button>
        </div>
      </div>

      {/* 树洞列表 */}
      {treeholeItems.length === 0 ? (
        <EmptyState
          title="还没有树洞哦"
          description="在这里写下想对TA说的悄悄话吧"
        />
      ) : (
        <div className="space-y-4">
          {treeholeItems.map((item, i) => (
            <div
              key={item.id}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
            >
              {/* 作者标签 */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{
                    background: item.author === 'partnerA'
                      ? 'rgba(255, 107, 157, 0.1)'
                      : 'rgba(196, 69, 105, 0.1)',
                    color: item.author === 'partnerA' ? '#FF6B9D' : '#C44569',
                  }}
                >
                  {item.author === 'partnerA' ? settings?.partnerAName || '我' : settings?.partnerBName || 'TA'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatRelative(item.createdAt)}
                  </span>
                  <button
                    onClick={() => deleteTreehole(item.id)}
                    className="text-[#ccc] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* 内容 */}
              <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                {item.content}
              </p>

              {/* 媒体预览 */}
              {item.media.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {item.media.slice(0, expandedId === item.id ? undefined : 4).map((m, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handlePreview(item.media, idx)}
                    >
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
                    </div>
                  ))}
                  {item.media.length > 4 && expandedId !== item.id && (
                    <button
                      onClick={() => setExpandedId(item.id)}
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255, 107, 157, 0.08)', color: 'var(--color-primary)' }}
                    >
                      +{item.media.length - 4}
                    </button>
                  )}
                </div>
              )}

              {/* 位置 */}
              {item.location && (
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <MapPin size={12} />
                  {item.location.address}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 添加弹窗 */}
      <AddModal title="写一条树洞" open={showAdd} onClose={() => setShowAdd(false)}>
        <div className="space-y-4">
          {/* 作者选择 */}
          <div className="relative" ref={authorRef}>
            <button
              type="button"
              onClick={() => setShowAuthorMenu(!showAuthorMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span>发送者：</span>
              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                {author === 'partnerA' ? (settings?.partnerAName || '我') : (settings?.partnerBName || 'TA')}
              </span>
              <ChevronDown size={14} />
            </button>
            {showAuthorMenu && (
              <div className="absolute top-full mt-1 bg-white rounded-xl shadow-lg border py-1 z-10" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                  onClick={() => { setAuthor('partnerA'); setShowAuthorMenu(false); }}
                >
                  {settings?.partnerAName || '我'}
                </button>
                <button
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                  onClick={() => { setAuthor('partnerB'); setShowAuthorMenu(false); }}
                >
                  {settings?.partnerBName || 'TA'}
                </button>
              </div>
            )}
          </div>

          {/* 内容输入 */}
          <textarea
            className="input-field min-h-[120px] resize-none"
            placeholder="写下你想说的话..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* 媒体上传 */}
          <MediaUploader
            media={media}
            onAdd={handleAddMedia}
            onRemove={(i) => setMedia((prev) => prev.filter((_, idx) => idx !== i))}
          />

          {/* 位置 */}
          <LocationPicker
            location={location}
            loading={locLoading}
            error={locError}
            onGetLocation={handleGetLocation}
            onClear={() => setLocation(null)}
          />

          {/* 提交 */}
          <button
            onClick={handleAdd}
            disabled={uploading || (!content.trim() && media.length === 0)}
            className="btn-primary w-full text-sm disabled:opacity-50"
          >
            发布
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