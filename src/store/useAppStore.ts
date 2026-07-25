import { create } from 'zustand';
import type { AppSettings, TreeholeItem, EventItem, PhotoItem, PlanItem } from '@/types';
import * as storage from '@/utils/storage';

interface AppState {
  // 设置
  settings: AppSettings | null;
  isSetup: boolean;
  setSettings: (settings: AppSettings) => void;

  // 树洞
  treeholeItems: TreeholeItem[];
  loadTreehole: () => void;
  addTreehole: (item: TreeholeItem) => void;
  deleteTreehole: (id: string) => void;

  // 重要事件
  eventItems: EventItem[];
  loadEvents: () => void;
  addEvent: (item: EventItem) => void;
  deleteEvent: (id: string) => void;

  // 照片墙
  photoItems: PhotoItem[];
  loadPhotos: () => void;
  addPhotos: (items: PhotoItem[]) => void;
  deletePhoto: (id: string) => void;

  // 未来规划
  planItems: PlanItem[];
  loadPlans: () => void;
  addPlan: (item: PlanItem) => void;
  updatePlan: (id: string, updates: Partial<PlanItem>) => void;
  deletePlan: (id: string) => void;

  // 初始化
  init: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 设置
  settings: null,
  isSetup: false,
  setSettings: (settings) => {
    storage.saveSettings(settings);
    set({ settings, isSetup: true });
  },

  // 树洞
  treeholeItems: [],
  loadTreehole: () => set({ treeholeItems: storage.getTreehole() }),
  addTreehole: (item) => {
    storage.addTreehole(item);
    set((s) => ({ treeholeItems: [item, ...s.treeholeItems] }));
  },
  deleteTreehole: (id) => {
    storage.deleteTreehole(id);
    set((s) => ({ treeholeItems: s.treeholeItems.filter((i) => i.id !== id) }));
  },

  // 重要事件
  eventItems: [],
  loadEvents: () => set({ eventItems: storage.getEvents() }),
  addEvent: (item) => {
    storage.addEvent(item);
    set((s) => {
      const items = [...s.eventItems, item];
      items.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
      return { eventItems: items };
    });
  },
  deleteEvent: (id) => {
    storage.deleteEvent(id);
    set((s) => ({ eventItems: s.eventItems.filter((i) => i.id !== id) }));
  },

  // 照片墙
  photoItems: [],
  loadPhotos: () => set({ photoItems: storage.getPhotos() }),
  addPhotos: (items) => {
    storage.addPhotos(items);
    set((s) => ({ photoItems: [...items, ...s.photoItems] }));
  },
  deletePhoto: (id) => {
    storage.deletePhoto(id);
    set((s) => ({ photoItems: s.photoItems.filter((i) => i.id !== id) }));
  },

  // 未来规划
  planItems: [],
  loadPlans: () => set({ planItems: storage.getPlans() }),
  addPlan: (item) => {
    storage.addPlan(item);
    set((s) => ({ planItems: [...s.planItems, item] }));
  },
  updatePlan: (id, updates) => {
    storage.updatePlan(id, updates);
    set((s) => ({
      planItems: s.planItems.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },
  deletePlan: (id) => {
    storage.deletePlan(id);
    set((s) => ({ planItems: s.planItems.filter((i) => i.id !== id) }));
  },

  // 初始化
  init: () => {
    const settings = storage.getSettings();
    set({
      settings,
      isSetup: !!settings,
      treeholeItems: storage.getTreehole(),
      eventItems: storage.getEvents(),
      photoItems: storage.getPhotos(),
      planItems: storage.getPlans(),
    });
  },
}));