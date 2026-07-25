import { useState } from 'react';
import { Plus, MapPin, Trash2, Target, CheckCircle2, Clock, Image, Video } from 'lucide-react';
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
import type { MediaItem, Location as LocationType, PlanItem } from '@/types';

export default function PlansPage() {
  const { planItems, addPlan, updatePlan, deletePlan } = useAppStore();
  const { uploadFiles, uploading } = useMediaUpload();
  const { getLocation, loading: locLoading, error: locError } = useGeolocation();

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem[]>([]);

  const handleAdd = async () => {
    if (!title.trim()) return;

    addPlan({
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate ? new Date(targetDate).toISOString() : '',
      progress,
      status: progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending',
      createdAt: new Date().toISOString(),
      media,
      location,
    });

    setTitle('');
    setDescription('');
    setTargetDate('');
    setProgress(0);
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

  const handleProgress = (plan: PlanItem, newProgress: number) => {
    const status = newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'pending';
    updatePlan(plan.id, { progress: newProgress, status } as Partial<PlanItem>);
  };

  const handlePreview = (mediaItems: MediaItem[], index: number) => {
    setPreviewMedia(mediaItems);
    setPreviewIndex(index);
  };

  const getStatusConfig = (status: PlanItem['status']) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle2, color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.08)', label: '已完成' };
      case 'in_progress':
        return { icon: Clock, color: '#FF9800', bg: 'rgba(255, 152, 0, 0.08)', label: '进行中' };
      default:
        return { icon: Target, color: '#9E9E9E', bg: 'rgba(158, 158, 158, 0.08)', label: '待开始' };
    }
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
            <span className="gradient-text">未来规划</span>
          </h1>
          <button onClick={() => setShowAdd(true)} className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1">
            <Plus size={16} />
            添加
          </button>
        </div>
      </div>

      {/* 规划列表 */}
      {planItems.length === 0 ? (
        <EmptyState
          title="还没有未来规划"
          description="一起写下你们的梦想和目标吧"
        />
      ) : (
        <div className="space-y-4">
          {planItems.map((plan, i) => {
            const statusConfig = getStatusConfig(plan.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={plan.id}
                className="card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                {/* 状态标签 */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: statusConfig.bg, color: statusConfig.color }}
                  >
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-[#ccc] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 标题和描述 */}
                <h3 className="font-bold text-sm mb-1">{plan.title}</h3>
                {plan.description && (
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {plan.description}
                  </p>
                )}

                {/* 进度条 */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>进度</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                      {plan.progress}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${plan.progress}%`,
                          background: plan.status === 'completed'
                            ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                            : 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))',
                        }}
                      />
                    </div>
                    {/* 滑块调整进度 */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={plan.progress}
                      onChange={(e) => handleProgress(plan, Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 目标日期 */}
                {plan.targetDate && (
                  <div className="flex items-center gap-1 mb-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Target size={12} />
                    目标日期：{formatDate(plan.targetDate)}
                  </div>
                )}

                {/* 媒体预览 */}
                {plan.media.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {plan.media.map((m, idx) => (
                      <div
                        key={idx}
                        className="relative w-14 h-14 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handlePreview(plan.media, idx)}
                      >
                        {m.type === 'video' ? (
                          <>
                            <video src={m.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Video size={12} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 位置 */}
                {plan.location && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <MapPin size={12} />
                    {plan.location.address}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 添加弹窗 */}
      <AddModal title="添加未来规划" open={showAdd} onClose={() => setShowAdd(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              目标标题
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="例如：一起去旅行"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              描述
            </label>
            <textarea
              className="input-field min-h-[60px] resize-none"
              placeholder="描述你们的计划..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              目标日期
            </label>
            <input
              type="date"
              className="input-field"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              初始进度
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-bold w-10 text-right" style={{ color: 'var(--color-primary)' }}>
                {progress}%
              </span>
            </div>
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
            添加规划
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