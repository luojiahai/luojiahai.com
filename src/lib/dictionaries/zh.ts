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
    works: "/zh/works",
    posts: "/zh/posts",
    life: "/zh/life",
    use: "/zh/use",
    resume: "/zh/resume",
    about: "/zh/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `我正在看「${title}」 @luojiahai`,
      )}&url=${encodeURIComponent(`https://luojiahai.com${postLink}`)}`;
    },
  },
  labels: {
    home: "主页",
    works: "作品",
    posts: "技术",
    life: "生活",
    use: "使用",
    resume: "简历",
    about: "关于",
    latestTech: "技术",
    latestLife: "生活",
    worksSubtitle: "嘉海做的东西",
    useSubtitle: "我使用的东西。",
    recommended: "推荐",
    activity: "活动",
    categories: "分类",
    featured: "精选",
    archive: "归档",
    shareTo: "分享到：",
    brandName: "LUOJIAHAI",
    brandTagline: "Hello, World!",
    backToSection: {
      posts: "← 返回技术",
      life: "← 返回生活",
    },
    allSectionPosts: {
      posts: "← 全部技术文章",
      life: "← 全部生活文章",
    },
    notFoundStatus: "纸空了",
    notFoundTitle: "托盘已空",
    notFoundSubtitle: "请正确放入纸张以打印内容。",
    notFoundButton: "← 打印主页",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "打印于",
    reading: "最近阅读",
    films: "最近观影",
    music: "最近聆听",
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
  use: {
    intro: "我使用的东西。",
    groups: [
      {
        label: "硬件",
        items: [
          { label: "手机", value: "iPhone 13 Pro Max" },
          { label: "笔记本电脑", value: "MacBook Air 13-inch M5" },
          { label: "显示器", value: "Samsung LS27A700NWEXXY / Dell S2721QS" },
          { label: "扩展坞", value: "Dell D6000" },
          { label: "鼠标", value: "Logitech MX Master 3S" },
          { label: "键盘", value: "8BitDo Retro Fami / Keychron Q1" },
          {
            label: "音响",
            value: "Marshall Stockwell 2 / Ultimate Ears Boom 3",
          },
          { label: "充电宝", value: "Sharge Shargeek 140W 20000mAh" },
          { label: "手表", value: "Garmin Epix Pro (Gen 2) Sapphire 47mm" },
        ],
      },
      {
        label: "台式电脑",
        items: [
          { label: "处理器", value: "AMD Ryzen 7 5700G" },
          { label: "主板", value: "ASUS Prime B550M-A WiFi II" },
          { label: "显卡", value: "ASUS NVIDIA GeForce GTX 3060" },
          { label: "冷却", value: "Cooler Master MasterLiquid ML240L V2" },
          {
            label: "机箱",
            value: "Fractal Design Pop Mini Air RGB White Micro ATX",
          },
          { label: "电源", value: "Fractal Design ION Gold 750W" },
          { label: "内存", value: "Kingston Fury Beast RGB 2x16GB" },
          { label: "硬盘", value: "Samsung 980 Pro 1TB" },
        ],
      },
      {
        label: "飞行模拟",
        items: [
          {
            label: "操纵杆",
            value: "Thrustmaster TCA Sidestick Airbus Edition",
          },
          { label: "油门", value: "Winwing Ursa Minor 32 Throttle Metal" },
          { label: "气动构型面板", value: "Winwing 32 PAC Metal" },
        ],
      },
      {
        label: "相机",
        items: [
          { label: "电子相机", value: "Sony A7 I" },
          { label: "胶片相机", value: "Pentax S1a" },
          { label: "镜头", value: "Sony Zeiss 35mm f/2.8" },
          { label: "胶片", value: "Kodak Portra 400 / Fujifilm Fujicolor 200" },
        ],
      },
      {
        label: "软件",
        items: [
          { label: "AI", value: "Claude" },
          { label: "编辑器", value: "Visual Studio Code" },
          { label: "浏览器", value: "Edge" },
          { label: "终端", value: "Ghostty / Windows Terminal" },
          { label: "画图", value: "Draw.io / Mermaid" },
        ],
      },
    ],
  },
  works: [
    {
      name: "Code-by-wire",
      summary: "在一个控制台中驾驶编程智能体（Claude Code、Codex）并监控其遥测数据。",
      image: "/static/code-by-wire.svg",
      link: "https://codebywire.com",
      primary: true,
    },
  ],
  contacts: [
    {
      label: "GitHub",
      name: "@luojiahai",
      link: "https://github.com/luojiahai",
      icon: "github",
    },
    {
      label: "X (Twitter)",
      name: "@luojiahai",
      link: "https://x.com/luojiahai",
      icon: "x",
    },
    {
      label: "邮箱",
      name: "ljiahai@hotmail.com",
      link: "mailto:ljiahai@hotmail.com",
      icon: "mail",
    },
    {
      label: "领英",
      name: "in/luojiahai",
      link: "https://linkedin.com/in/luojiahai",
      icon: "linkedin",
    },
    {
      label: "Instagram",
      name: "@luojiahai",
      link: "https://instagram.com/luojiahai",
      icon: "instagram",
    },
    {
      label: "哔哩哔哩",
      name: "luojiahai",
      link: "https://space.bilibili.com/866961",
      icon: "bilibili",
    },
    {
      label: "小红书",
      name: "luojiahai",
      link: "https://www.xiaohongshu.com/user/profile/5c8e525c000000001203a0ba",
      icon: "xiaohongshu",
    },
    {
      label: "微博",
      name: "ljiahai",
      link: "https://weibo.com/ljiahai",
      icon: "weibo",
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
  archive: {
    // TODO(placeholder): 暂时为空，之后在这里补充内容。
    reading: [],
    films: [],
    music: [],
  },
  aboutContent: `
这里是 [luojiahai](https://luojiahai.com) 的角落。

不定期更新，分享一些随想随记，什么内容都有可能出现。

### 关于我

你好，我是罗嘉海。「luojiahai」是我中文名字的拼音，也是我在互联网上的常用 ID。

我在中国广州出生长大，目前住在澳大利亚墨尔本。

我是 INTJ，一名务实的计算机程序员，我做有用的东西。

写代码方面，我喜欢驾驶 Claude Code 和 Codex 这样的编程智能体，也因此做了 [Code-by-wire](https://codebywire.com)，在一个控制台里驾驶它们。

编程之外，我喜欢吃饭、做饭和逛超市。作为广州人，我偏爱粤式经典，尤其是肠粉。我还玩微软飞行模拟器，飞空客。

你可以在 [GitHub](https://github.com/luojiahai) 或 [X](https://x.com/luojiahai) 找到我，或者发邮件到 [ljiahai@hotmail.com](mailto:ljiahai@hotmail.com)。
  `,
};

export default dictionary;
