import { HealthMilestone, Achievement, UserProfile } from './types';

// ==========================================
// 💰 MONETIZATION CONFIGURATION (变现配置)
// ==========================================
export const PAYMENT_CONFIG = {
  // 赚钱步骤:
  // 1. 去 https://dashboard.stripe.com/payment-links 创建支付链接
  // 2. 确保在 Stripe 设置中将 "After payment" 跳转 URL 设置为: https://your-domain.com/?payment_success=true
  // 3. 将生成的链接填入下方。
  
  // 示例链接 (这是测试链接，正式上线请替换为你自己的 Stripe 链接):
  // 如果你还没有 Stripe，保留为空字符串 ""，App 将运行在演示模式（点击支付直接成功）。
  
  monthlyUrl: "", // 在这里填入月付链接 e.g. "https://buy.stripe.com/..."
  yearlyUrl: "",  // 在这里填入年付链接 e.g. "https://buy.stripe.com/..."
};

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

// Helper to calculate stats
const getStats = (user: UserProfile) => {
    const now = new Date();
    const quitDate = new Date(user.quitDate);
    const diffMs = now.getTime() - quitDate.getTime();
    const days = diffMs / (1000 * 60 * 60 * 24);
    const cigarettesAvoided = days * user.cigarettesPerDay;
    const moneySaved = (cigarettesAvoided / user.cigarettesPerPack) * user.costPerPack;
    return { days, moneySaved };
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'day1',
    title: { en: 'First Step', zh: '第一步' },
    icon: '🌱',
    description: { en: 'Completed your first 24 hours smoke-free.', zh: '完成了第一个 24 小时无烟挑战。' },
    condition: (user) => getStats(user).days >= 1,
  },
  {
    id: 'day3',
    title: { en: 'Determined', zh: '坚定不移' },
    icon: '🔥',
    description: { en: '3 days smoke-free. The nicotine is leaving your body.', zh: '3天无烟。尼古丁正在离开你的身体。' },
    condition: (user) => getStats(user).days >= 3,
  },
  {
    id: 'week1',
    title: { en: 'Week Warrior', zh: '周战士' },
    icon: '🛡️',
    description: { en: 'One full week without a cigarette.', zh: '整整一周没有吸烟。' },
    condition: (user) => getStats(user).days >= 7,
  },
  {
    id: 'month1',
    title: { en: 'Fresh Air', zh: '清新空气' },
    icon: '🌬️',
    description: { en: 'One month of clean lungs.', zh: '一个月的肺部清洁。' },
    condition: (user) => getStats(user).days >= 30,
  },
  {
    id: 'savings_small',
    title: { en: 'Pocket Money', zh: '零花钱' },
    icon: '🐷',
    description: { en: 'Saved your first 50 in currency.', zh: '节省了你的前 50 元。' },
    condition: (user) => getStats(user).moneySaved >= 50,
  },
  {
    id: 'savings_big',
    title: { en: 'Wealth Builder', zh: '财富积累' },
    icon: '💰',
    description: { en: 'Saved over 500 in currency.', zh: '节省了超过 500 元。' },
    condition: (user) => getStats(user).moneySaved >= 500,
  },
  {
    id: 'craving1',
    title: { en: 'Craving Crusher', zh: '欲望粉碎者' },
    icon: '🥊',
    description: { en: 'Successfully managed 1 craving with the timer.', zh: '使用计时器成功抵御了1次烟瘾。' },
    condition: (user) => (user.cravingsResisted || 0) >= 1,
  },
  {
    id: 'craving10',
    title: { en: 'Zen Master', zh: '禅修大师' },
    icon: '🧘',
    description: { en: 'Successfully managed 10 cravings.', zh: '成功抵御了10次烟瘾。' },
    condition: (user) => (user.cravingsResisted || 0) >= 10,
  }
];