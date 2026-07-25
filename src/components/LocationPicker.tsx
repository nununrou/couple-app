import { MapPin, Loader2 } from 'lucide-react';
import type { Location } from '@/types';

interface Props {
  location: Location | null;
  loading: boolean;
  error: string | null;
  onGetLocation: () => void;
  onClear: () => void;
}

export default function LocationPicker({ location, loading, error, onGetLocation, onClear }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onGetLocation}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border transition-colors disabled:opacity-50"
        style={{
          borderColor: location ? 'var(--color-primary)' : 'var(--color-border)',
          color: location ? 'var(--color-primary)' : '#666',
        }}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <MapPin size={16} />
        )}
        {location ? '已定位' : '添加位置'}
      </button>
      {location && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[#999] hover:text-[#C44569] transition-colors"
        >
          清除
        </button>
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}