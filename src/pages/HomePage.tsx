import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, TreePine, CalendarHeart, Images, MapPin, Sparkles, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getLoveDays, getRandomQuote } from '@/utils/date';
import type { AppSettings } from '@/types';

const moduleCards = [
  {
    path: '/treehole',
    icon: TreePine,
    title: '树洞',
    desc: '倾诉心底的秘密',
    color: '#FF6B9D',
    bg: 'rgba(255, 107, 157, 0.08)',
  },
  {
    path: '/events',
    icon: CalendarHeart,
    title: '重要事件',
    desc: '记录我们的故事',
    color: '#C44569',
    bg: 'rgba(196, 69, 105, 0.08)',
  },
  {
    path: '/photos',
    icon: Images,
    title: '照片墙',
    desc: '定格美好瞬间',
    color: '#FF8A65',
    bg: 'rgba(255, 138, 101, 0.08)',
  },
  {
    path: '/plans',
    icon: MapPin,
    title: '未来规划',
    desc: '一起走向远方',
    color: '#7E57C2',
    bg: 'rgba(126, 87, 194, 0.08)',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { settings, isSetup, setSettings, treeholeItems, eventItems, photoItems, planItems } = useAppStore();
  const [showSetup, setShowSetup] = useState(false);
  const [quote] = useState(() => getRandomQuote());
  const [form, setForm] = useState<AppSettings>({
    partnerAName: settings?.partnerAName || '',
    partnerBName: settings?.partnerBName || '',
    startDate: settings?.startDate || '',
  });

  const loveDays = settings ? getLoveDays(settings.startDate) : 0;

  const handleSave = () => {
    if (!form.partnerAName || !form.partnerBName || !form.startDate) return;
    setSettings(form);
    setShowSetup(false);
  };

  return (
    <div className="page-container">
      {/* 顶部渐变区域 */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-10 px-5 pt-8 pb-6"
        style={{
          background: 'linear-gradient(180deg, #FFF5F7 60%, rgba(255,245,247,0) 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <span className="gradient-text">心动时光</span>
          </h1>
          <button
            onClick={() => setShowSetup(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <Settings size={18} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* 恋爱卡片 */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 mb-6 text-white animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #7E3B5E 100%)',
          boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)',
        }}
      >
        {/* 装饰性背景圆形 */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          {isSetup ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={20} className="animate-heart-beat" />
                <span className="text-sm opacity-90">我们已经在一起</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {loveDays}
                </span>
                <span className="text-lg opacity-80">天</span>
              </div>
              <p className="text-sm opacity-80 mt-2">
                {settings.partnerAName} <Heart size={12} className="inline mx-1" /> {settings.partnerBName}
              </p>
              <p className="mt-4 text-sm opacity-70 italic leading-relaxed">
                "{quote}"
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <Sparkles size={32} className="mx-auto mb-3 opacity-80" />
              <p className="text-lg font-bold mb-2">欢迎来到心动时光</p>
              <p className="text-sm opacity-80 mb-4">点击右上角设置，开始记录你们的甜蜜时光</p>
              <button
                onClick={() => setShowSetup(true)}
                className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm font-bold"
              >
                开始设置
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 模块入口 */}
      <div className="grid grid-cols-2 gap-3">
        {moduleCards.map((card, i) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="card text-left animate-fade-in-up"
            style={{
              animationDelay: `${0.1 * (i + 1)}s`,
              opacity: 0,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: card.bg }}
            >
              <card.icon size={20} style={{ color: card.color }} />
            </div>
            <h3 className="font-bold text-sm mb-1">{card.title}</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {card.desc}
            </p>
            {/* 最近动态提示 */}
            <div className="mt-3 flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: card.color }}
              />
              <span className="text-xs opacity-50">
                {card.path === '/treehole' && treeholeItems.length > 0 && `${treeholeItems.length} 条心事`}
                {card.path === '/events' && eventItems.length > 0 && `${eventItems.length} 个瞬间`}
                {card.path === '/photos' && photoItems.length > 0 && `${photoItems.length} 张照片`}
                {card.path === '/plans' && planItems.length > 0 && `${planItems.length} 个目标`}
                {((card.path === '/treehole' && treeholeItems.length === 0) ||
                  (card.path === '/events' && eventItems.length === 0) ||
                  (card.path === '/photos' && photoItems.length === 0) ||
                  (card.path === '/plans' && planItems.length === 0)) &&
                  '等待记录'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 设置弹窗 */}
      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSetup(false)} />
          <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 animate-slide-up">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              设置你们的恋爱信息
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  你的昵称
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="输入你的昵称"
                  value={form.partnerAName}
                  onChange={(e) => setForm({ ...form, partnerAName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  TA的昵称
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="输入TA的昵称"
                  value={form.partnerBName}
                  onChange={(e) => setForm({ ...form, partnerBName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  恋爱开始日期
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSetup(false)}
                className="flex-1 py-3 rounded-full border text-sm font-bold transition-colors"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                取消
              </button>
              <button onClick={handleSave} className="flex-1 btn-primary text-sm">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}