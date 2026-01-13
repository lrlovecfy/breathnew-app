import { HealthMilestone, Achievement } from './types';

export const HEALTH_MILESTONES: HealthMilestone[] = [
  {
    id: 'bp',
    title: { en: 'Normal Blood Pressure', zh: '血压恢复正常' },
    description: { en: 'Your blood pressure and pulse rate drop to normal levels.', zh: '您的血压和脉搏降至正常水平。' },
    durationSeconds: 20 * 60, // 20 mins
  },
  {
    id: 'co',
    title: { en: 'Carbon Monoxide Levels', zh: '一氧化碳水平' },
    description: { en: 'Carbon monoxide level in your blood drops to normal.', zh: '血液中的一氧化碳水平降至正常。' },
    durationSeconds: 12 * 60 * 60, // 12 hours
  },
  {
    id: 'heart_attack',
    title: { en: 'Heart Attack Risk', zh: '心脏病风险' },
    description: { en: 'Your chance of a heart attack begins to decrease.', zh: '心脏病发作的几率开始下降。' },
    durationSeconds: 24 * 60 * 60, // 24 hours
  },
  {
    id: 'senses',
    title: { en: 'Taste and Smell', zh: '味觉和嗅觉' },
    description: { en: 'Nerve endings begin to regrow. Ability to smell and taste improves.', zh: '神经末梢开始再生。嗅觉和味觉能力提高。' },
    durationSeconds: 48 * 60 * 60, // 48 hours
  },
  {
    id: 'nicotine',
    title: { en: 'Nicotine Free', zh: '尼古丁清除' },
    description: { en: 'Your body is 100% nicotine-free. Most withdrawal symptoms peak here.', zh: '您的身体已 100% 清除尼古丁。戒断症状通常在此达到顶峰。' },
    durationSeconds: 72 * 60 * 60, // 3 days
  },
  {
    id: 'energy',
    title: { en: 'Energy Boost', zh: '能量提升' },
    description: { en: 'Circulation improves and lung function increases.', zh: '血液循环改善，肺功能增强。' },
    durationSeconds: 14 * 24 * 60 * 60, // 2 weeks
  },
  {
    id: 'cough',
    title: { en: 'Coughing & Shortness of Breath', zh: '咳嗽和气短' },
    description: { en: 'Coughing and shortness of breath decrease.', zh: '咳嗽和气短的症状减轻。' },
    durationSeconds: 30 * 24 * 60 * 60, // 1 month
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'day1',
    title: { en: 'First Step', zh: '第一步' },
    icon: '🌱',
    description: { en: 'Completed your first 24 hours smoke-free.', zh: '完成了第一个 24 小时无烟挑战。' },
    condition: (days) => days >= 1,
  },
  {
    id: 'week1',
    title: { en: 'Week Warrior', zh: '周战士' },
    icon: '🛡️',
    description: { en: 'One full week without a cigarette.', zh: '整整一周没有吸烟。' },
    condition: (days) => days >= 7,
  },
  {
    id: 'month1',
    title: { en: 'Fresh Air', zh: '清新空气' },
    icon: '🌬️',
    description: { en: 'One month of clean lungs.', zh: '一个月的肺部清洁。' },
    condition: (days) => days >= 30,
  },
  {
    id: 'savings',
    title: { en: 'Money Maker', zh: '省钱达人' },
    icon: '💰',
    description: { en: 'You are saving significant money now.', zh: '您现在已经节省了一大笔钱。' },
    condition: (days) => days >= 14,
  }
];