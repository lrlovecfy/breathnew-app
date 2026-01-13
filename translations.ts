import { Language } from './types';

export const TRANSLATIONS = {
  en: {
    app: {
      name: "BreathNew",
      reset: "Reset",
      resetConfirm: "Are you sure you want to reset all data? This cannot be undone."
    },
    onboarding: {
      welcome: "Welcome to BreathNew",
      subtitle: "Your journey to a smoke-free life starts here.",
      nameLabel: "What should we call you?",
      namePlaceholder: "Your Name",
      next: "Next",
      cigsLabel: "Cigarettes per day?",
      cigsPlaceholder: "e.g. 15",
      costLabel: "Cost per pack?",
      costPlaceholder: "e.g. 12.50",
      back: "Back",
      start: "Start Journey"
    },
    dashboard: {
      greeting: "Hello",
      smokeFree: "Smoke-free for",
      days: "days",
      hours: "hrs",
      mins: "mins",
      moneySaved: "Money Saved",
      notSmoked: "Not Smoked",
      lifeRegained: "Life Regained",
      lifeRegainedUnit: "hours",
      lifeRegainedNote: "Based on 11 mins per cigarette",
      healingTitle: "Healing in progress",
      healingBody: "Your lungs are beginning to clear out mucus and other smoking debris. Keep breathing deeply!",
      upgradeBanner: "Upgrade to PRO to unlock full health insights and unlimited AI coaching.",
      upgradeButton: "Upgrade",
      proBadge: "PRO MEMBER",
      dailySummaryBtn: "View Daily Summary",
      cravingTimerBtn: "Craving Timer"
    },
    dailySummary: {
        title: "Daily Summary",
        subtitle: "Your daily achievements",
        avoided: "Cigarettes Avoided",
        saved: "Money Saved",
        milestone: "Latest Milestone",
        close: "Keep Going"
    },
    cravingTimer: {
      title: "Ride the Wave",
      subtitle: "Cravings only last a few minutes. You can do this.",
      breatheIn: "Breathe In...",
      breatheOut: "Breathe Out...",
      hold: "Hold...",
      successTitle: "You did it!",
      successSubtitle: "The craving has passed. Here is a tip to stay strong:",
      close: "Back to Dashboard",
      giveUp: "Stop Timer",
      newTip: "Get another tip",
      addTip: "Add your own tip",
      save: "Save",
      cancel: "Cancel",
      tipPlaceholder: "Write your tip...",
      playTip: "Listen to tip"
    },
    timeline: {
        title: "Recovery Timeline",
        locked: "Pro Feature",
        lockedDesc: "Upgrade to unlock advanced health recovery milestones.",
        unlock: "Unlock"
    },
    coach: {
        title: "AI Coach",
        sos: "SOS: CRAVING",
        placeholder: "Type a message...",
        thinking: "Thinking...",
        error: "Unable to connect to AI Coach",
        errorDesc: "Please ensure your API Key is correctly configured.",
        initialMessage: "Hi {name}! I'm your BreathNew Coach. I'm here to support your journey. Feeling a craving? Or just want to talk about your progress?",
        sosMessage: "I'm having a really bad craving right now! Help!",
        limitReached: "Daily free message limit reached.",
        upgradeToChat: "Upgrade to chat unlimited",
        messageDeleted: "Message deleted",
        undo: "Undo",
        share: "Share Chat",
        shareSuccess: "Conversation copied to clipboard!",
        shareProgress: "Share Progress",
        shareProgressSuccess: "Progress copied to clipboard!",
        shareProgressText: "I've been smoke-free for {days} days and saved {currency}{saved} with BreathNew! 🌿",
        listening: "Listening..."
    },
    nav: {
        home: "Home",
        health: "Health",
        coach: "Coach"
    },
    paywall: {
        title: "Go BreathNew PRO",
        subtitle: "Maximize your success rate with premium features.",
        feature1: "Unlimited AI Coach Access",
        feature2: "Full Health Recovery Timeline",
        feature3: "Advanced Statistics & Insights",
        price: "$4.99 / Month",
        restore: "Restore Purchase",
        cta: "Upgrade Now",
        cancel: "No thanks"
    }
  },
  zh: {
    app: {
      name: "BreathNew",
      reset: "重置",
      resetConfirm: "您确定要重置所有数据吗？此操作无法撤销。"
    },
    onboarding: {
      welcome: "欢迎来到 BreathNew",
      subtitle: "您的无烟生活从此开始。",
      nameLabel: "怎么称呼您？",
      namePlaceholder: "您的名字",
      next: "下一步",
      cigsLabel: "每天吸烟数量？",
      cigsPlaceholder: "例如 15",
      costLabel: "每包价格？",
      costPlaceholder: "例如 25",
      back: "返回",
      start: "开始旅程"
    },
    dashboard: {
      greeting: "你好",
      smokeFree: "已戒烟",
      days: "天",
      hours: "小时",
      mins: "分钟",
      moneySaved: "节省金钱",
      notSmoked: "少抽烟支",
      lifeRegained: "赢回生命",
      lifeRegainedUnit: "小时",
      lifeRegainedNote: "基于每支烟减少11分钟寿命计算",
      healingTitle: "身体正在修复",
      healingBody: "你的肺部开始清除粘液和吸烟残留物。继续深呼吸！",
      upgradeBanner: "升级到 PRO 解锁完整健康分析和无限 AI 教练。",
      upgradeButton: "升级",
      proBadge: "PRO 会员",
      dailySummaryBtn: "查看今日总结",
      cravingTimerBtn: "烟瘾计时器"
    },
    dailySummary: {
        title: "每日总结",
        subtitle: "您今天的成就",
        avoided: "今日少吸",
        saved: "今日省钱",
        milestone: "最新里程碑",
        close: "继续保持"
    },
    cravingTimer: {
      title: "冲浪式应对",
      subtitle: "烟瘾只持续几分钟。你能做到的。",
      breatheIn: "吸气...",
      breatheOut: "呼气...",
      hold: "保持...",
      successTitle: "你做到了！",
      successSubtitle: "烟瘾已经过去了。这里有一个保持坚强的小贴士：",
      close: "返回首页",
      giveUp: "停止计时",
      newTip: "换一个建议",
      addTip: "添加自定义建议",
      save: "保存",
      cancel: "取消",
      tipPlaceholder: "输入你的建议...",
      playTip: "朗读建议"
    },
    timeline: {
        title: "康复时间轴",
        locked: "会员功能",
        lockedDesc: "升级以查看高级健康康复里程碑。",
        unlock: "解锁"
    },
    coach: {
        title: "AI Coach",
        sos: "紧急求助",
        placeholder: "输入消息...",
        thinking: "思考中...",
        error: "无法连接到 AI 教练",
        errorDesc: "请确保正确配置了 API 密钥。",
        initialMessage: "你好 {name}！我是你的 BreathNew 教练。我在这里支持你的戒烟旅程。想抽烟了吗？还是想聊聊你的进展？",
        sosMessage: "我现在非常想抽烟！救救我！",
        limitReached: "已达到每日免费消息上限。",
        upgradeToChat: "升级无限畅聊",
        messageDeleted: "消息已删除",
        undo: "撤销",
        share: "分享对话",
        shareSuccess: "对话已复制到剪贴板！",
        shareProgress: "分享进度",
        shareProgressSuccess: "进度已复制到剪贴板！",
        shareProgressText: "通过 BreathNew，我已经戒烟 {days} 天，节省了 {currency}{saved}！🌿",
        listening: "正在聆听..."
    },
    nav: {
        home: "首页",
        health: "健康",
        coach: "教练"
    },
    paywall: {
        title: "升级 BreathNew PRO",
        subtitle: "使用高级功能最大化您的戒烟成功率。",
        feature1: "无限次 AI 教练对话",
        feature2: "完整健康康复时间轴",
        feature3: "高级统计数据与洞察",
        price: "¥28.00 / 月",
        restore: "恢复购买",
        cta: "立即升级",
        cancel: "暂不需要"
    }
  }
} as const;