import { Heart } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({ icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center opacity-0 animate-fade-in-up">
      <div className="mb-4 text-[#FFB8D0]">
        {icon || <Heart size={48} />}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      )}
    </div>
  );
}