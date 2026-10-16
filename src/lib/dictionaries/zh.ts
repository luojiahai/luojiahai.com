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
    // 导航键的无障碍名称和页面标题都叫「文章」，「项目」同理。
    posts: "文章",
    projects: "项目",
    use: "使用",
    about: "关于",
    recentPosts: "最近文章",
    viewAll: "查看全部",
    postsSubtitle: "我写的东西。",
    projectsSubtitle: "我做的东西。",
    useSubtitle: "我使用的东西。",
    empty: "这里还没有内容。",
    brandName: "LUOJIAHAI",
    brandTagline: "The sky is not the limit.",
    backToPosts: "‹ 返回文章",
    allPosts: "‹ 全部文章",
    notFoundStatus: "纸空了",
    notFoundTitle: "托盘已空",
    notFoundSubtitle: "请正确放入纸张以打印内容。",
    notFoundButton: "← 打印主页",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    wechatScanHint: "微信扫码阅读原文",
    shareToX: "分享到 X",
    aboutSignOff: "就酱～",
    skipToContent: "跳到主要内容",
    primaryNavigation: "主导航",
    switchLanguage: "Switch to English",
    annLt: "信号灯",
    annLtPositions: {
      test: "测试所有指示灯",
      brt: "明亮：浅色模式",
      dim: "调暗：深色模式",
    },
    annLtFlip: "拨动信号灯开关",
    masterWarning: "主警告：按下以确认",
    lastUpdate: "最后更新",
    entries(count: number) {
      return `${count} 条`;
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
    since: "加入",
    emailHint: "邮件会直达我的收件箱。",
    telegramHint: "私信随时开放，欢迎来聊。",
  },
};

export default dictionary;
