import { useState } from 'react';
import { Plus, MapPin, Trash2, Image, Video } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useGeolocation } from '@/hooks/useGeolocation';
import { generateId } from '@/utils/id';
import { formatDate } from '@/utils/date';
import AddModal from '@/components/AddModal';
import MediaUploader from '@/components/MediaUploader';
import LocationPicker from '@/components/LocationPicker';
import MediaPreview from '@/components/MediaPreview';
import EmptyState from '@/components/EmptyState';
import type { MediaItem, Location as LocationType } from '@/types';

export default function EventsPage() {
  const { eventItems, addEvent, deleteEvent } = useAppStore();
  const { uploadFiles, uploading } = useMediaUpload();
  const { getLocation, loading: locLoading, error: locError } = useGeolocation();

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem[]>([]);

  const handleAdd = async () => {
    if (!title.trim()) return;

    addEvent({
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      eventDate: new Date(eventDate).toISOString(),
      createdAt: new Date().toISOString(),
      media,
      location,
    });

    setTitle('');
    setDescription('');
    setEventDate(new Date().toISOString().slice(0, 10));
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

  // 按年份分组
  const groupedEvents = eventItems.reduce<Record<string, typeof eventItems>>((acc, item) => {
    const year = new Date(item.eventDate).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const years = Object.keys(groupedEvents).sort((a, b) => Number(b) - Number(a));

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
            <span className="gradient-text">重要事件</span>
          </h1>
          <button onClick={() => setShowAdd(true)} className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1">
            <Plus size={16} />
            记录
          </button>
        </div>
      </div>

      {/* 时间线 */}
      {eventItems.length === 0 ? (
        <EmptyState
          title="还没有重要事件"
          description="记录你们之间的每一个重要时刻吧"
        />
      ) : (
        <div className="relative">
          {/* 时间线左侧竖线 */}
          <div
            className="absolute left-[19px] top-2 bottom-2 w-0.5"
            style={{
              background: 'linear-gradient(180deg, var(--color-primary), var(--color-primary-light), transparent)',
            }}
          />

          {years.map((year) => (
            <div key={year} className="mb-6">
              {/* 年份标记 */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold z-10"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    boxShadow: '0 2px 10px rgba(255, 107, 157, 0.3)',
                  }}
                >
                  {year}
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                  {year}年
                </span>
              </div>

              {/* 事件列表 */}
              {groupedEvents[year].map((event, i) => (
                <div
                  key={event.id}
                  className="flex gap-3 mb-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                >
                  {/* 时间线圆点 */}
                  <div className="flex flex-col items-center pt-1.5">
                    <div
                      className="w-3 h-3 rounded-full border-2 z-10"
                      style={{
                        borderColor: 'var(--color-primary)',
                        background: 'var(--color-bg)',
                      }}
                    />
                  </div>

                  {/* 事件卡片 */}
                  <div className="flex-1 card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-sm">{event.title}</h3>
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(event.eventDate)}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-[#ccc] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {event.description && (
                      <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {event.description}
                      </p>
                    )}

                    {/* 媒体 */}
                    {event.media.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-2">
                        {event.media.map((m, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handlePreview(event.media, idx)}
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
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        <MapPin size={12} />
                        {event.location.address}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 添加弹窗 */}
      <AddModal title="记录重要事件" open={showAdd} onClose={() => setShowAdd(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              事件标题
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="例如：第一次约会"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              事件日期
            </label>
            <input
              type="date"
              className="input-field"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              描述
            </label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder="描述一下这个美好的时刻..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <MediaUploader
            media={media}
            onAdd={handleAddMedia}
            onRemove={(i) => setMedia((prev) => prev.filter((_, idx) => idx !== i))}
          />

          <LocationPicker
            location={location}
            loading={locLoading}
            error={locError}
            onGetLocation={handleGetLocation}
            onClear={() => setLocation(null)}
          />

          <button
            onClick={handleAdd}
            disabled={uploading || !title.trim()}
            className="btn-primary w-full text-sm disabled:opacity-50"
          >
            添加事件
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