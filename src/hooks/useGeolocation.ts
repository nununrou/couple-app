import { useState, useCallback } from 'react';
import type { Location } from '@/types';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback((): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('浏览器不支持定位功能');
        resolve(null);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(false);
          resolve({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        (err) => {
          setLoading(false);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('定位权限被拒绝');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('无法获取位置信息');
              break;
            case err.TIMEOUT:
              setError('定位超时');
              break;
            default:
              setError('定位失败');
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  return { getLocation, loading, error };
}