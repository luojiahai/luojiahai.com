import type { IconName } from "$lib/icons";

interface Contact {
  label: string;
  name: string;
  link: string;
  icon: IconName;
}

interface ArchiveEntry {
  title: string;
  summary: string;
}

interface Work {
  name: string;
  summary: string;
  image?: string;
  link: string;
  primary: boolean;
}

const contacts: Contact[] = [
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
    label: "Email",
    name: "ljiahai@hotmail.com",
    link: "mailto:ljiahai@hotmail.com",
    icon: "mail",
  },
  {
    label: "LinkedIn",
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
    label: "Bilibili",
    name: "luojiahai",
    link: "https://space.bilibili.com/866961",
    icon: "bilibili",
  },
  {
    label: "Xiaohongshu",
    name: "luojiahai",
    link: "https://www.xiaohongshu.com/user/profile/5c8e525c000000001203a0ba",
    icon: "xiaohongshu",
  },
  {
    label: "Weibo",
    name: "ljiahai",
    link: "https://weibo.com/ljiahai",
    icon: "weibo",
  },
];

const dictionary = {
  meta: {
    baseUrl: "https://luojiahai.com",
    name: "Luo, Jiahai",
    websiteName: "luojiahai",
    motto: "Hello, World!",
    mottos: ["Hello, World!"],
    fillKeywords(keywords?: string[]): string[] {
      return [
        "luojiahai",
        "Luo Jiahai",
        "Jiahai Luo",
        "罗嘉海",
        "luojiahai Website",
        "Personal Blog",
        "Personal Website",
        "Software Engineer",
        "Melbourne",
        ...(keywords ?? []),
      ];
    },
  },
  urls: {
    home: "/en",
    works: "/en/works",
    posts: "/en/posts",
    life: "/en/life",
    use: "/en/use",
    resume: "/en/resume",
    about: "/en/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `I am reading ${title.toLocaleUpperCase()} @luojiahai`,
      )}&url=${encodeURIComponent(`https://luojiahai.com${postLink}`)}`;
    },
  },
  labels: {
    home: "Home",
    works: "Works",
    posts: "Tech",
    life: "Life",
    use: "Use",
    resume: "Resume",
    about: "About",
    latestTech: "Tech",
    latestLife: "Life",
    worksSubtitle: "Things Jiahai has made",
    useSubtitle: "Things I'm using.",
    recommended: "Recommended",
    activity: "Activity",
    categories: "Categories",
    featured: "Featured",
    archive: "Archive",
    shareTo: "Share to: ",
    brandName: "LUOJIAHAI",
    brandTagline: "Hello, World!",
    backToSection: {
      posts: "← BACK TO TECH",
      life: "← BACK TO LIFE",
    },
    allSectionPosts: {
      posts: "← ALL TECH POSTS",
      life: "← ALL LIFE POSTS",
    },
    notFoundStatus: "Paper Tray Empty",
    notFoundTitle: "Out of Paper",
    notFoundSubtitle: "Please insert paper correctly to print content.",
    notFoundButton: "← Print Home",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "Printed on",
    reading: "Recent Reading",
    films: "Recent Films",
    music: "Recent Listening",
    aboutTitle: "About",
    aboutSubtitle: "Hello, World!",
    wechatScanHint: "Scan to read on WeChat",
    entries(count: number) {
      return `${count} ${count === 1 ? "entry" : "entries"}`;
    },
    icon(label: string) {
      return `Icon for ${label}`;
    },
  },
  use: {
    intro: "Things I'm using.",
    groups: [
      {
        label: "Hardware",
        items: [
          { label: "Mobile", value: "iPhone 13 Pro Max" },
          { label: "Laptop", value: "Microsoft Surface Pro 5 2017" },
          { label: "Monitor", value: "Samsung LS27A700NWEXXY / Dell S2721QS" },
          { label: "Dock", value: "Dell D6000" },
          { label: "Mouse", value: "Logitech MX Master 3S" },
          { label: "Keyboard", value: "8BitDo Retro Fami / Keychron Q1" },
          {
            label: "Speaker",
            value: "Marshall Stockwell 2 / Ultimate Ears Boom 3",
          },
          { label: "Power Bank", value: "Sharge Shargeek 140W 20000mAh" },
          { label: "Watch", value: "Garmin Epix Pro (Gen 2) Sapphire 47mm" },
        ],
      },
      {
        label: "Desktop Computer",
        items: [
          { label: "Processor", value: "AMD Ryzen 7 5700G" },
          { label: "Motherboard", value: "ASUS Prime B550M-A WiFi II" },
          { label: "Graphics", value: "ASUS NVIDIA GeForce GTX 3060" },
          { label: "Cooling", value: "Cooler Master MasterLiquid ML240L V2" },
          {
            label: "Case",
            value: "Fractal Design Pop Mini Air RGB White Micro ATX",
          },
          { label: "Power Supply", value: "Fractal Design ION Gold 750W" },
          { label: "Memory", value: "Kingston Fury Beast RGB 2x16GB" },
          { label: "SSD", value: "Samsung 980 Pro 1TB" },
        ],
      },
      {
        label: "Flight Simulator",
        items: [
          {
            label: "Joystick",
            value: "Thrustmaster TCA Sidestick Airbus Edition",
          },
          { label: "Throttle", value: "Winwing Ursa Minor 32 Throttle Metal" },
          {
            label: "Aerodynamic Control Panel",
            value: "Winwing 32 PAC Metal",
          },
        ],
      },
      {
        label: "Camera",
        items: [
          { label: "Digital Camera", value: "Sony A7 I" },
          { label: "Film Camera", value: "Pentax S1a" },
          { label: "Lens", value: "Sony Zeiss 35mm f/2.8" },
          { label: "Films", value: "Kodak Portra 400 / Fujifilm Fujicolor 200" },
        ],
      },
      {
        label: "Software",
        items: [
          { label: "AI", value: "Claude" },
          { label: "Editor", value: "Visual Studio Code" },
          { label: "Browser", value: "Edge" },
          { label: "Terminal", value: "iTerm2 / Windows Terminal" },
          { label: "Diagramming", value: "Draw.io / Mermaid" },
        ],
      },
    ],
  },
  works: [
    {
      name: "Code-by-wire",
      summary:
        "Pilot coding agents (Claude Code, Codex) and monitor their telemetry from one console.",
      image: "/static/code-by-wire.svg",
      link: "https://codebywire.com",
      primary: true,
    },
  ] as Work[],
  contacts,
  social: {
    followers: "Followers",
    following: "Following",
    posts: "Posts",
    repos: "Repos",
    contributions: "Contribs/yr",
    recentActivity: "Recent activity",
    since(year: string) {
      return `since ${year}`;
    },
    emailTo: "To",
    emailHint: "Mail lands straight in my inbox.",
    telegramHint: "DMs open, say hi anytime.",
  },
  archive: {
    // TODO(placeholder): intentionally empty for now, fill these in later.
    reading: [] as ArchiveEntry[],
    films: [] as ArchiveEntry[],
    music: [] as ArchiveEntry[],
  },
  aboutContent: `
This is the corner of [luojiahai](https://luojiahai.com).

Updated irregularly, sharing random things. Anything could appear here.

### About Me

Hi there, I'm Jiahai. "luojiahai" is the Pinyin (Mandarin romanization) of my Chinese name, 罗嘉海, and I use it as my internet handle.

I was born and raised in Guangzhou, China, and I'm currently based in Melbourne, Australia.

I'm an INTJ and a pragmatic computer programmer. I build useful things.

When it comes to code, I pilot coding agents like Claude Code and Codex, and I like that way of working enough that I built [Code-by-wire](https://codebywire.com) to fly them from one console.

Outside of programming, I like eating, cooking, and grocery shopping. Being from Guangzhou, I have a soft spot for Cantonese classics, 肠粉 above all. I also play Microsoft Flight Simulator, flying Airbus.

You can find me on [GitHub](https://github.com/luojiahai) or [X](https://x.com/luojiahai), or email me at [ljiahai@hotmail.com](mailto:ljiahai@hotmail.com).
  `,
};

export default dictionary;

export type Dictionary = typeof dictionary;
