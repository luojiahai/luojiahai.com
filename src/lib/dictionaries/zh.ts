import { SITE_URL } from "$lib/site-config";
import type { Dictionary } from "./en";

const dictionary: Dictionary = {
  meta: {
    name: "罗嘉海",
    websiteName: "luojiahai",
    motto: "你好，世界！",
    fillKeywords(keywords?: string[]): string[] {
      return [
        "luojiahai",
        "罗嘉海",
        "Luo Jiahai",
        "罗嘉海的个人主页",
        "个人主页",
        "个人网站",
        "个人博客",
        "软件工程师",
        "墨尔本",
        ...(keywords ?? []),
      ];
    },
  },
  urls: {
    home: "/zh",
    posts: "/zh/posts",
    projects: "/zh/projects",
    use: "/zh/use",
    about: "/zh/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `我正在看「${title}」 @luojiahai`,
      )}&url=${encodeURIComponent(`${SITE_URL}${postLink}`)}`;
    },
  },
  labels: {
    home: "主页",
    // 导航标签、页面标题和主页的板块标题都叫「文章」，「项目」同理。
    posts: "文章",
    projects: "项目",
    use: "使用",
    about: "关于",
    postsSubtitle: "我写的东西。",
    projectsSubtitle: "我做的东西。",
    useSubtitle: "我使用的东西。",
    empty: "这里还没有内容。",
    brandName: "LUOJIAHAI",
    brandTagline: "The sky is not the limit.",
    backToPosts: "← 返回文章",
    notFoundSystem: "导航",
    notFoundTitle: "页面未找到",
    notFoundSteps: {
      home: ["主页", "按下"],
      posts: ["文章", "检查"],
      url: ["网址", "核对"],
    },
    notFoundAck: "按下 MASTER WARN 以确认",
    notFoundAcked: "告警已确认 · 请按程序处置",
    notFoundButton: "◂ 返回主页",
    masterWarn: "主警告：按下以确认",
    profile: "简介",
    viewAllProjects: "全部项目 ▸",
    viewAllPosts: "全部文章 ▸",
    displaySections: "显示页",
    postFilter: "按分类筛选文章",
    allCategories: "全部",
    filterSummary(name: string, count: number) {
      return `筛选 ${name} · ${count} 条`;
    },
    contents: "目录",
    keywords: "关键词",
    updated: "更新于",
    readingTime(minutes: number) {
      return `约 ${minutes} 分钟`;
    },
    readingProgress: "阅读进度",
    projectsHint: "指向一个项目，即可直飞该航点。",
    projectMap: "项目航图",
    openProject: "打开",
    wechatScanHint: "微信扫码阅读原文",
    shareToX: "分享到 X",
    aboutSignOff: "就酱～",
    skipToContent: "跳到主要内容",
    primaryNavigation: "主导航",
    switchLanguage: "Switch to English",
    colorModes: { system: "跟随系统", light: "浅色", dark: "深色" },
    colorMode(mode: string) {
      return `颜色模式：${mode}`;
    },
  },
  contacts: [
    {
      label: "X (Twitter)",
      link: "https://x.com/luojiahai",
      kind: "x",
    },
    {
      label: "GitHub",
      link: "https://github.com/luojiahai",
      kind: "github",
    },
    {
      label: "邮箱",
      link: "mailto:hi@luojiahai.com",
      kind: "email",
    },
    {
      label: "Telegram",
      link: "https://t.me/luojiahai",
      kind: "telegram",
    },
    {
      label: "Instagram",
      link: "https://instagram.com/luojiahai",
      kind: "instagram",
    },
  ],
  social: {
    followers: "关注者",
    following: "关注中",
    posts: "帖子",
    repos: "仓库",
    contributions: "年贡献",
    recentActivity: "近期活动",
    since(year: string) {
      return `${year} 年至今`;
    },
    emailTo: "收件人",
    emailHint: "邮件会直达我的收件箱。",
    telegramHint: "私信随时开放，欢迎来聊。",
  },
};

export default dictionary;
