import { useLocation, useNavigate } from 'react-router-dom';
import { Home, TreePine, CalendarHeart, Images, MapPin } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/treehole', icon: TreePine, label: '树洞' },
  { path: '/events', icon: CalendarHeart, label: '事件' },
  { path: '/photos', icon: Images, label: '照片' },
  { path: '/plans', icon: MapPin, label: '规划' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 glass border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 relative"
            >
              {active && (
                <div
                  className="absolute -top-1 w-8 h-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
                />
              )}
              <Icon
                size={22}
                style={{
                  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  transition: 'color 0.2s',
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: active ? 700 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}