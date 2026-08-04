import type { Dictionary } from "./en";

const dictionary: Dictionary = {
  meta: {
    baseUrl: "https://luojiahai.com",
    name: "罗嘉海",
    websiteName: "luojiahai",
    motto: "你好，世界！",
    mottos: ["你好，世界！"],
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
      )}&url=${encodeURIComponent(`https://luojiahai.com${postLink}`)}`;
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
    brandTagline: "Hello, World!",
    backToPosts: "← 返回文章",
    allPosts: "← 全部文章",
    notFoundStatus: "纸空了",
    notFoundTitle: "托盘已空",
    notFoundSubtitle: "请正确放入纸张以打印内容。",
    notFoundButton: "← 打印主页",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "打印于",
    wechatScanHint: "微信扫码阅读原文",
    entries(count: number) {
      return `${count} 条`;
    },
    icon(label: string) {
      return `${label}的图标`;
    },
  },
  contacts: [
    {
      label: "X (Twitter)",
      name: "@luojiahai",
      link: "https://x.com/luojiahai",
      icon: "x",
    },
    {
      label: "GitHub",
      name: "@luojiahai",
      link: "https://github.com/luojiahai",
      icon: "github",
    },
    {
      label: "邮箱",
      name: "hi@luojiahai.com",
      link: "mailto:hi@luojiahai.com",
      icon: "mail",
    },
    {
      label: "Telegram",
      name: "@luojiahai",
      link: "https://t.me/luojiahai",
      icon: "send",
    },
    {
      label: "Instagram",
      name: "@luojiahai",
      link: "https://instagram.com/luojiahai",
      icon: "instagram",
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
  fly: [
    {
      slug: "fbw-a32nx",
      summary: "由 FlyByWire Simulations 制作的空客 A320neo（A320-251N）。",
    },
  ],
};

export default dictionary;
