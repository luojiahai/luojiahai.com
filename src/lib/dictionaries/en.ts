import type { IconName } from "$lib/icons";
import type { AircraftSlug } from "../../params/aircraft";

interface Contact {
  label: string;
  name: string;
  link: string;
  icon: IconName;
}

interface Work {
  name: string;
  summary: string;
  image?: string;
  link: string;
}

/** The aircraft name and URL come from the registry; only the copy is here. */
interface FlyEntry {
  slug: AircraftSlug;
  summary: string;
}

const contacts: Contact[] = [
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
    label: "Email",
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
    posts: "/en/posts",
    projects: "/en/projects",
    use: "/en/use",
    about: "/en/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `I am reading ${title.toLocaleUpperCase()} @luojiahai`,
      )}&url=${encodeURIComponent(`https://luojiahai.com${postLink}`)}`;
    },
  },
  labels: {
    home: "Home",
    // The nav tab, the page title, and the home page's section header all
    // read "Posts"; the same holds for "Projects".
    posts: "Posts",
    projects: "Projects",
    use: "Use",
    about: "About",
    postsSubtitle: "Things I write.",
    projectsSubtitle: "Things I build.",
    useSubtitle: "Things I'm using.",
    fly: "Fly",
    empty: "Nothing here yet.",
    shareTo: "Share to: ",
    brandName: "LUOJIAHAI",
    brandTagline: "Hello, World!",
    backToPosts: "← BACK TO POSTS",
    allPosts: "← ALL POSTS",
    notFoundStatus: "Paper Tray Empty",
    notFoundTitle: "Out of Paper",
    notFoundSubtitle: "Please insert paper correctly to print content.",
    notFoundButton: "← Print Home",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "Printed on",
    aboutTitle: "About",
    aboutSubtitle: "Things about me.",
    wechatScanHint: "Scan to read on WeChat",
    entries(count: number) {
      return `${count} ${count === 1 ? "entry" : "entries"}`;
    },
    icon(label: string) {
      return `Icon for ${label}`;
    },
  },
  use: {
    groups: [
      {
        label: "Hardware",
        items: [
          { label: "Mobile", value: "iPhone 13 Pro Max" },
          { label: "Laptop", value: "MacBook Air 13-inch M5" },
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
          { label: "Coding Agent", value: "Claude Code / Codex" },
          { label: "Editor", value: "Visual Studio Code" },
          { label: "Browser", value: "Edge" },
          { label: "Terminal", value: "Ghostty / Windows Terminal" },
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
      link: "https://github.com/luojiahai/code-by-wire",
    },
    {
      name: "Potato",
      summary:
        "Stash long terminal commands, find them by fuzzy search, and hand them back.",
      image: "/static/potato.svg",
      link: "https://github.com/luojiahai/potato",
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
  // Sim companions. These open outside the printer shell, since they are
  // built to sit on a second screen next to the simulator.
  fly: [
    {
      slug: "fbw-a32nx",
      summary:
        "Airbus A320neo (A320-251N) built by FlyByWire Simulations.",
    },
  ] as FlyEntry[],
  aboutContent: `
This is my website. I update it irregularly, sharing random things. Anything could appear here. "luojiahai" is the Pinyin (Mandarin romanization) of my Chinese name, 罗嘉海, and I use it as my internet handle.

I'm an INTJ (a personality type with the Introverted, Intuitive, Thinking, and Judging traits). I was born and raised in Guangzhou, China, and I'm currently based in Melbourne, Australia. I'm a pragmatic computer programmer. I build useful things.

Outside of programming, I like eating, cooking, and grocery shopping. McDonald's is my favourite restaurant. I have lots of McDonald's merch. I'm a Costco Executive member. I enjoy shopping there. Even walking the aisles and buying nothing is fine.

I'm an aviation enthusiast. I play Microsoft Flight Simulator. I fly the Airbus A320 (A32NX) built by [FlyByWire](https://flybywiresim.com/), practicing realistic piloting: procedures, radio communications, and the aviation knowledge behind them.

You can find me on [X](https://x.com/luojiahai) or [GitHub](https://github.com/luojiahai), or email me at [hi@luojiahai.com](mailto:hi@luojiahai.com).
  `,
};

export default dictionary;

export type Dictionary = typeof dictionary;
