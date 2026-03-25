"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "en" | "zh";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.myMachines": "My Machines",
    "nav.tickets": "Support Tickets",
    "nav.catalog": "Product Catalog",
    "nav.kb": "Knowledge Base",
    "nav.customers": "Customers",
    "nav.allMachines": "All Machines",
    "nav.allTickets": "All Tickets",
    "nav.manageCatalog": "Manage Catalog",
    "nav.logout": "Logout",
    "nav.adminPanel": "Admin Panel",
    "nav.servicePlatform": "Service Platform",

    // Dashboard
    "dash.welcome": "Welcome back,",
    "dash.adminDashboard": "Admin Dashboard",
    "dash.totalMachines": "Total Machines",
    "dash.activeMachines": "Active Machines",
    "dash.openTickets": "Open Tickets",
    "dash.customers": "Customers",
    "dash.criticalTickets": "Critical Tickets",
    "dash.inMaintenance": "In Maintenance",
    "dash.pendingVerification": "Pending Verification",
    "dash.recentTickets": "Recent Tickets",
    "dash.viewAll": "View all →",
    "dash.quickActions": "Quick Actions",
    "dash.browseCatalog": "Browse Catalog",
    "dash.knowledgeBase": "Knowledge Base",
    "dash.registerMachine": "Register Machine",
    "dash.reportProblem": "Report Problem",

    // Catalog
    "catalog.title": "Product Catalog",
    "catalog.subtitle": "Raycus Fiber Laser Sources — Full Portfolio",
    "catalog.all": "All",
    "catalog.models": "models",
    "catalog.model": "model",
    "catalog.backToCatalog": "← Back to Catalog",
    "catalog.inProduction": "In Production",
    "catalog.discontinued": "Discontinued",
    "catalog.documents": "Documents",
    "catalog.noDocuments": "No documents uploaded yet.",
    "catalog.quickActions": "Quick Actions",
    "catalog.registerThisModel": "Register This Model",
    "catalog.errorCodeRef": "Error Code Reference",
    "catalog.specifications": "Specifications",
    "catalog.applications": "Applications",
    "catalog.relatedArticles": "Related Knowledge Base Articles",
    "catalog.download": "Download",

    // Machines
    "machines.title": "My Machines",
    "machines.register": "+ Register Machine",
    "machines.noMachines": "You haven't registered any machines yet.",
    "machines.registerFirst": "Register Your First Machine",
    "machines.registerTitle": "Register a Machine",
    "machines.registerDesc": "Enter your machine details — warranty is calculated automatically",
    "machines.serialNumber": "Serial Number",
    "machines.model": "Model",
    "machines.selectModel": "Select a model...",
    "machines.purchaseDate": "Purchase Date",
    "machines.warranty": "Warranty",
    "machines.warrantyAuto": "auto-calculated for",
    "machines.expires": "Expires",
    "machines.years": "years",
    "machines.registering": "Registering...",
    "machines.registerBtn": "Register Machine",
    "machines.backToMachines": "← Back to My Machines",
    "machines.pendingVerification": "Pending Verification",
    "machines.verified": "Verified",

    // Tickets
    "tickets.title": "Support Tickets",
    "tickets.subtitle": "Report problems with your machines",
    "tickets.new": "+ New Ticket",
    "tickets.noTickets": "No support tickets yet.",
    "tickets.createFirst": "Create Your First Ticket",
    "tickets.reportProblem": "Report a Problem",
    "tickets.reportDesc": "Describe the issue with your machine",
    "tickets.machine": "Machine",
    "tickets.selectMachine": "Select a machine...",
    "tickets.errorCode": "Error Code (if applicable)",
    "tickets.noErrorCode": "No specific error code",
    "tickets.priority": "Priority",
    "tickets.subject": "Subject",
    "tickets.description": "Description",
    "tickets.submit": "Submit Ticket",
    "tickets.submitting": "Submitting...",
    "tickets.backToTickets": "← Back to Tickets",
    "tickets.problemDesc": "Problem Description",
    "tickets.conversation": "Conversation",
    "tickets.changeStatus": "Change status:",
    "tickets.sendMessage": "Send Message",
    "tickets.sending": "Sending...",
    "tickets.noMessages": "No messages yet.",
    "tickets.messages": "messages",
    "tickets.message": "message",
    "tickets.adminReply": "Reply to customer...",
    "tickets.customerReply": "Add more details or respond...",
    "tickets.allTickets": "All Support Tickets",
    "tickets.manageDesc": "Manage customer service requests",

    // Statuses
    "status.open": "Open",
    "status.in_progress": "In Progress",
    "status.waiting_customer": "Waiting on Customer",
    "status.resolved": "Resolved",
    "status.closed": "Closed",
    "status.active": "Active",
    "status.maintenance": "Maintenance",

    // Priority
    "priority.critical": "Critical",
    "priority.high": "High",
    "priority.normal": "Normal",
    "priority.low": "Low",
    "priority.criticalDesc": "Critical — Production stopped",
    "priority.highDesc": "High — Production affected",
    "priority.normalDesc": "Normal — Standard service request",
    "priority.lowDesc": "Low — Minor issue, not urgent",

    // KB
    "kb.title": "Knowledge Base",
    "kb.subtitle": "Guides, troubleshooting, and best practices for Raycus fiber lasers",
    "kb.search": "Search articles...",
    "kb.noArticles": "No articles found",
    "kb.backToKB": "← Back to Knowledge Base",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signingIn": "Signing in...",
    "auth.createAccount": "Create Account",
    "auth.creatingAccount": "Creating account...",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.company": "Company",
    "auth.phone": "Phone",
    "auth.noAccount": "Don't have an account?",
    "auth.register": "Register",
    "auth.hasAccount": "Already have an account?",
    "auth.demoAccounts": "Demo accounts:",

    // Common
    "common.power": "Power",
    "common.avgPower": "Avg Power",
    "common.wavelength": "Wavelength",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.verify": "Verify",
    "common.loading": "Loading...",
    "common.created": "Created",
    "common.by": "By",
  },
  zh: {
    // Nav
    "nav.dashboard": "仪表盘",
    "nav.myMachines": "我的设备",
    "nav.tickets": "服务工单",
    "nav.catalog": "产品目录",
    "nav.kb": "知识库",
    "nav.customers": "客户管理",
    "nav.allMachines": "所有设备",
    "nav.allTickets": "所有工单",
    "nav.manageCatalog": "目录管理",
    "nav.logout": "退出登录",
    "nav.adminPanel": "管理后台",
    "nav.servicePlatform": "服务平台",

    // Dashboard
    "dash.welcome": "欢迎回来，",
    "dash.adminDashboard": "管理仪表盘",
    "dash.totalMachines": "设备总数",
    "dash.activeMachines": "运行设备",
    "dash.openTickets": "待处理工单",
    "dash.customers": "客户数量",
    "dash.criticalTickets": "紧急工单",
    "dash.inMaintenance": "维修中",
    "dash.pendingVerification": "待审核",
    "dash.recentTickets": "最新工单",
    "dash.viewAll": "查看全部 →",
    "dash.quickActions": "快捷操作",
    "dash.browseCatalog": "浏览产品",
    "dash.knowledgeBase": "知识库",
    "dash.registerMachine": "注册设备",
    "dash.reportProblem": "提交问题",

    // Catalog
    "catalog.title": "产品目录",
    "catalog.subtitle": "锐科光纤激光器 — 全系列产品",
    "catalog.all": "全部",
    "catalog.models": "个型号",
    "catalog.model": "个型号",
    "catalog.backToCatalog": "← 返回产品目录",
    "catalog.inProduction": "在产",
    "catalog.discontinued": "停产",
    "catalog.documents": "技术文档",
    "catalog.noDocuments": "暂无文档。",
    "catalog.quickActions": "快捷操作",
    "catalog.registerThisModel": "注册此型号设备",
    "catalog.errorCodeRef": "错误代码参考",
    "catalog.specifications": "技术参数",
    "catalog.applications": "应用领域",
    "catalog.relatedArticles": "相关知识库文章",
    "catalog.download": "下载",

    // Machines
    "machines.title": "我的设备",
    "machines.register": "+ 注册设备",
    "machines.noMachines": "您还没有注册任何设备。",
    "machines.registerFirst": "注册您的第一台设备",
    "machines.registerTitle": "注册设备",
    "machines.registerDesc": "输入设备信息 — 保修期将自动计算",
    "machines.serialNumber": "序列号",
    "machines.model": "型号",
    "machines.selectModel": "选择型号...",
    "machines.purchaseDate": "购买日期",
    "machines.warranty": "保修期",
    "machines.warrantyAuto": "自动计算，适用于",
    "machines.expires": "到期日",
    "machines.years": "年",
    "machines.registering": "注册中...",
    "machines.registerBtn": "注册设备",
    "machines.backToMachines": "← 返回我的设备",
    "machines.pendingVerification": "待审核",
    "machines.verified": "已审核",

    // Tickets
    "tickets.title": "服务工单",
    "tickets.subtitle": "提交设备问题报告",
    "tickets.new": "+ 新建工单",
    "tickets.noTickets": "暂无服务工单。",
    "tickets.createFirst": "创建第一个工单",
    "tickets.reportProblem": "提交问题",
    "tickets.reportDesc": "描述设备遇到的问题",
    "tickets.machine": "设备",
    "tickets.selectMachine": "选择设备...",
    "tickets.errorCode": "错误代码（如适用）",
    "tickets.noErrorCode": "无特定错误代码",
    "tickets.priority": "优先级",
    "tickets.subject": "主题",
    "tickets.description": "问题描述",
    "tickets.submit": "提交工单",
    "tickets.submitting": "提交中...",
    "tickets.backToTickets": "← 返回工单列表",
    "tickets.problemDesc": "问题描述",
    "tickets.conversation": "对话记录",
    "tickets.changeStatus": "更改状态：",
    "tickets.sendMessage": "发送消息",
    "tickets.sending": "发送中...",
    "tickets.noMessages": "暂无消息。",
    "tickets.messages": "条消息",
    "tickets.message": "条消息",
    "tickets.adminReply": "回复客户...",
    "tickets.customerReply": "补充详情或回复...",
    "tickets.allTickets": "所有服务工单",
    "tickets.manageDesc": "管理客户服务请求",

    // Statuses
    "status.open": "待处理",
    "status.in_progress": "处理中",
    "status.waiting_customer": "等待客户",
    "status.resolved": "已解决",
    "status.closed": "已关闭",
    "status.active": "运行中",
    "status.maintenance": "维修中",

    // Priority
    "priority.critical": "紧急",
    "priority.high": "高",
    "priority.normal": "普通",
    "priority.low": "低",
    "priority.criticalDesc": "紧急 — 生产停止",
    "priority.highDesc": "高 — 生产受影响",
    "priority.normalDesc": "普通 — 常规服务请求",
    "priority.lowDesc": "低 — 小问题，不紧急",

    // KB
    "kb.title": "知识库",
    "kb.subtitle": "锐科光纤激光器指南、故障排除和最佳实践",
    "kb.search": "搜索文章...",
    "kb.noArticles": "未找到相关文章",
    "kb.backToKB": "← 返回知识库",

    // Auth
    "auth.signIn": "登录",
    "auth.signingIn": "登录中...",
    "auth.createAccount": "创建账户",
    "auth.creatingAccount": "创建中...",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.fullName": "姓名",
    "auth.company": "公司",
    "auth.phone": "电话",
    "auth.noAccount": "没有账户？",
    "auth.register": "注册",
    "auth.hasAccount": "已有账户？",
    "auth.demoAccounts": "演示账户：",

    // Common
    "common.power": "功率",
    "common.avgPower": "平均功率",
    "common.wavelength": "波长",
    "common.back": "返回",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.delete": "删除",
    "common.verify": "审核",
    "common.loading": "加载中...",
    "common.created": "创建于",
    "common.by": "由",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("locale") as Locale) || "en";
    }
    return "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale]?.[key] || translations.en[key] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
      title={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <span className="text-sm">{locale === "en" ? "🇨🇳" : "🇬🇧"}</span>
      <span>{locale === "en" ? "中文" : "EN"}</span>
    </button>
  );
}
