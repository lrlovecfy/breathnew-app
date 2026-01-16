export type Language = 'en' | 'zh';

export interface LocalizedContent {
  en: string;
  zh: string;
}

export interface UserProfile {
  name: string;
  quitDate: string; // ISO string
  cigarettesPerDay: number;
  costPerPack: number;
  cigarettesPerPack: number;
  currency: string;
  isPro: boolean; // Monetization status
  cravingsResisted: number;
  notificationsEnabled?: boolean;
  notificationFrequency?: 'daily' | 'weekly';
  lastNotificationDate?: string; // ISO string
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HealthMilestone {
  id: string;
  title: LocalizedContent;
  description: LocalizedContent;
  durationSeconds: number;
}

export interface Achievement {
  id: string;
  title: LocalizedContent;
  icon: string;
  description: LocalizedContent;
  condition: (user: UserProfile) => boolean;
}