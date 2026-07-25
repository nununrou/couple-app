import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AddModal({ title, open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in-up"
        onClick={onClose}
      />

      {/* 弹窗 */}
      <div
        className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up"
        style={{ animationDuration: '0.3s' }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-[#999]" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}