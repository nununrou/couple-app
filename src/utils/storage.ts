import type { AppSettings, TreeholeItem, EventItem, PhotoItem, PlanItem } from '@/types';

const KEYS = {
  settings: 'couple-app-settings',
  treehole: 'couple-app-treehole',
  events: 'couple-app-events',
  photos: 'couple-app-photos',
  plans: 'couple-app-plans',
} as const;

// 通用读写
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// 设置
export function getSettings(): AppSettings | null {
  return getItem<AppSettings | null>(KEYS.settings, null);
}

export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.settings, settings);
}

// 树洞
export function getTreehole(): TreeholeItem[] {
  return getItem<TreeholeItem[]>(KEYS.treehole, []);
}

export function saveTreehole(items: TreeholeItem[]): void {
  setItem(KEYS.treehole, items);
}

export function addTreehole(item: TreeholeItem): void {
  const items = getTreehole();
  items.unshift(item);
  saveTreehole(items);
}

export function deleteTreehole(id: string): void {
  const items = getTreehole().filter((i) => i.id !== id);
  saveTreehole(items);
}

// 重要事件
export function getEvents(): EventItem[] {
  return getItem<EventItem[]>(KEYS.events, []);
}

export function saveEvents(items: EventItem[]): void {
  setItem(KEYS.events, items);
}

export function addEvent(item: EventItem): void {
  const items = getEvents();
  items.push(item);
  items.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  saveEvents(items);
}

export function deleteEvent(id: string): void {
  const items = getEvents().filter((i) => i.id !== id);
  saveEvents(items);
}

// 照片墙
export function getPhotos(): PhotoItem[] {
  return getItem<PhotoItem[]>(KEYS.photos, []);
}

export function savePhotos(items: PhotoItem[]): void {
  setItem(KEYS.photos, items);
}

export function addPhotos(items: PhotoItem[]): void {
  const all = [...items, ...getPhotos()];
  savePhotos(all);
}

export function deletePhoto(id: string): void {
  const items = getPhotos().filter((i) => i.id !== id);
  savePhotos(items);
}

// 未来规划
export function getPlans(): PlanItem[] {
  return getItem<PlanItem[]>(KEYS.plans, []);
}

export function savePlans(items: PlanItem[]): void {
  setItem(KEYS.plans, items);
}

export function addPlan(item: PlanItem): void {
  const items = getPlans();
  items.push(item);
  savePlans(items);
}

export function updatePlan(id: string, updates: Partial<PlanItem>): void {
  const items = getPlans().map((p) => (p.id === id ? { ...p, ...updates } : p));
  savePlans(items);
}

export function deletePlan(id: string): void {
  const items = getPlans().filter((i) => i.id !== id);
  savePlans(items);
}