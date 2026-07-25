// 通用媒体项
export interface MediaItem {
  type: 'image' | 'video';
  url: string;       // Base64 数据
  thumbnail?: string; // 视频缩略图 Base64
}

// 通用位置信息
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// 应用设置
export interface AppSettings {
  partnerAName: string;
  partnerBName: string;
  startDate: string; // ISO 8601
}

// 树洞项
export interface TreeholeItem {
  id: string;
  content: string;
  createdAt: string;
  media: MediaItem[];
  location: Location | null;
  author: 'partnerA' | 'partnerB';
}

// 重要事件项
export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
  media: MediaItem[];
  location: Location | null;
}

// 照片墙项
export interface PhotoItem {
  id: string;
  title: string;
  createdAt: string;
  media: MediaItem[];
  location: Location | null;
}

// 未来规划项
export interface PlanItem {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  media: MediaItem[];
  location: Location | null;
}

// localStorage 存储结构
export interface LocalStorageSchema {
  'couple-app-settings': AppSettings;
  'couple-app-treehole': TreeholeItem[];
  'couple-app-events': EventItem[];
  'couple-app-photos': PhotoItem[];
  'couple-app-plans': PlanItem[];
}