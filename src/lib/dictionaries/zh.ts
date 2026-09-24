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
    fly: "飞行",
    empty: "这里还没有内容。",
    shareTo: "分享到：",
    brandName: "LUOJIAHAI",
    brandTagline: "The sky is not the limit.",
    backToPosts: "← 返回文章",
    allPosts: "← 全部文章",
    notFoundStatus: "纸空了",
    notFoundTitle: "托盘已空",
    notFoundSubtitle: "请正确放入纸张以打印内容。",
    notFoundButton: "← 打印主页",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "打印于",
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
    lightSwitchOn: "拉绳开灯",
    lightSwitchOff: "拉绳关灯",
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
    since(year: string) {
      return `${year} 年至今`;
    },
    emailTo: "收件人",
    emailHint: "邮件会直达我的收件箱。",
    telegramHint: "私信随时开放，欢迎来聊。",
  },
};

export default dictionary;
