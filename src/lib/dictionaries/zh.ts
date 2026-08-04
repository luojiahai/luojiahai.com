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
    tech: "/zh/tech",
    about: "/zh/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `我正在看「${title}」 @luojiahai`,
      )}&url=${encodeURIComponent(`https://luojiahai.com${postLink}`)}`;
    },
  },
  labels: {
    home: "主页",
    // 导航标签、页面标题和板块标题都叫「文章」。
    posts: "文章",
    tech: "技术",
    about: "关于",
    postsSubtitle: "我写的东西。",
    techSubtitle: "关于技术的东西。",
    fly: "飞行",
    projects: "项目",
    empty: "这里还没有内容。",
    shareTo: "分享到：",
    brandName: "LUOJIAHAI",
    brandTagline: "Hello, World!",
    deck: "机顶",
    deckOptions: {
      none: "空",
      plane: "飞机",
      snail: "蜗牛",
    },
    backToPosts: "← 返回文章",
    allPosts: "← 全部文章",
    notFoundStatus: "纸空了",
    notFoundTitle: "托盘已空",
    notFoundSubtitle: "请正确放入纸张以打印内容。",
    notFoundButton: "← 打印主页",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "打印于",
    aboutTitle: "关于",
    aboutSubtitle: "你好，世界！",
    wechatScanHint: "微信扫码阅读原文",
    entries(count: number) {
      return `${count} 条`;
    },
    icon(label: string) {
      return `${label}的图标`;
    },
  },
  works: [
    {
      name: "Code-by-wire",
      summary: "在一个控制台中驾驶编程智能体（Claude Code、Codex）并监控其遥测数据。",
      image: "/static/code-by-wire.svg",
      link: "https://github.com/luojiahai/code-by-wire",
    },
    {
      name: "Potato",
      summary: "收纳冗长的终端命令，通过模糊搜索找到并取回。",
      image: "/static/potato.svg",
      link: "https://github.com/luojiahai/potato",
    },
  ],
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
  aboutContent: `
这里是 [luojiahai](https://luojiahai.com) 的互联网角落。

不定期更新，分享一些随想随记，什么内容都有可能出现。

### 关于我

你好，我是罗嘉海。「luojiahai」是我中文名字的拼音，也是我在互联网上的常用 ID。

我是 INTJ。我在中国广州出生长大，目前住在澳大利亚墨尔本。可惜我不喜欢咖啡，我喝水和可口可乐。

我是一名务实的计算机程序员，我做有用的东西，也参与开源贡献。AI 是我生活和工作的一部分，[我不和不用 AI 的人说话](/zh/posts/i-dont-talk-to-people-who-dont-use-ai)。

编程之外，我喜欢吃饭、做饭和逛超市。麦当劳是我的首选餐厅，我还有很多麦当劳周边。我是开市客的黑钻会员，喜欢去那里购物，就算在过道里走走什么都不买也挺好。

我是航空爱好者。我玩微软飞行模拟器，飞 [FlyByWire](https://flybywiresim.com/) 制作的空客 A320（A32NX），练习真实的驾驶：飞行程序、无线电通话，以及背后的航空知识。

你可以在 [X](https://x.com/luojiahai) 或 [GitHub](https://github.com/luojiahai) 找到我，或者发邮件到 [hi@luojiahai.com](mailto:hi@luojiahai.com)。
  `,
};

export default dictionary;
