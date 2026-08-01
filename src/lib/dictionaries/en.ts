import type { IconName } from "$lib/icons";
import type { AircraftSlug } from "../../params/aircraft";

interface Contact {
  label: string;
  name: string;
  link: string;
  icon: IconName;
}

interface RecentEntry {
  title: string;
  summary: string;
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
    tech: "/en/tech",
    life: "/en/life",
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
    tech: "Tech",
    life: "Life",
    use: "Use",
    about: "About",
    // Section header shared by the Tech and Life pages.
    posts: "Posts",
    latestTech: "Tech",
    latestLife: "Life",
    sectionSubtitle: {
      tech: "Things about tech.",
      life: "Things about my life.",
    },
    useSubtitle: "Things I'm using.",
    activity: "Activity",
    fly: "Fly",
    projects: "Projects",
    empty: "Nothing here yet.",
    shareTo: "Share to: ",
    brandName: "LUOJIAHAI",
    brandTagline: "Hello, World!",
    deck: "Deck",
    deckOptions: {
      none: "Empty",
      plane: "Plane",
      snail: "Snail",
    },
    backToSection: {
      tech: "← BACK TO TECH",
      life: "← BACK TO LIFE",
    },
    allSectionPosts: {
      tech: "← ALL TECH POSTS",
      life: "← ALL LIFE POSTS",
    },
    notFoundStatus: "Paper Tray Empty",
    notFoundTitle: "Out of Paper",
    notFoundSubtitle: "Please insert paper correctly to print content.",
    notFoundButton: "← Print Home",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "Printed on",
    reading: "Recent Reading",
    watching: "Recent Watching",
    listening: "Recent Listening",
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
    connections: "Connections",
    telegramHint: "DMs open, say hi anytime.",
  },
  // Newest first: the Life page prints the top entry of each list as a preview.
  recent: {
    reading: [
      {
        title: "The Pragmatic Programmer",
        summary: "Andrew Hunt and David Thomas, on the craft of software.",
      },
    ] as RecentEntry[],
    watching: [
      {
        title: "Air Crash Investigation",
        summary: "Aviation accidents, reconstructed one flight per episode.",
      },
    ] as RecentEntry[],
    listening: [
      {
        title: "Every Little Part",
        summary: "Le Youth",
      },
    ] as RecentEntry[],
  },
  // Sim companions. These open outside the printer shell, since they are
  // built to sit on a second screen next to the simulator.
  fly: [
    {
      slug: "fbw-a32nx",
      summary:
        "FlyByWire's beginner guide as a gate to gate tick-off checklist, with lights, radio calls and Airbus abbreviations.",
    },
  ] as FlyEntry[],
  aboutContent: `
This is [luojiahai](https://luojiahai.com)'s corner of the internet.

Updated irregularly, sharing random things. Anything could appear here.

### About Me

Hi there, I'm Jiahai. "luojiahai" is the Pinyin (Mandarin romanization) of my Chinese name, 罗嘉海, and I use it as my internet handle.

I'm an INTJ. I was born and raised in Guangzhou, China, and I'm currently based in Melbourne, Australia. Unfortunately I'm not into coffee. I drink water and Coca-Cola.

I'm a pragmatic computer programmer. I build useful things and contribute to open source. AI is part of my life and work. [I don't talk to people who don't use AI](/en/life/i-dont-talk-to-people-who-dont-use-ai).

Outside of programming, I like eating, cooking, and grocery shopping. McDonald's is my go-to restaurant. I have lots of McDonald's merch. I'm a Costco Executive member. I enjoy shopping there. Even walking the aisles and buying nothing is fine.

I'm an aviation enthusiast. I play Microsoft Flight Simulator. I fly the Airbus A320 (A32NX) built by [FlyByWire](https://flybywiresim.com/), practicing realistic piloting: procedures, radio communications, and the aviation knowledge behind them.

You can find me on [X](https://x.com/luojiahai) or [GitHub](https://github.com/luojiahai), or email me at [hi@luojiahai.com](mailto:hi@luojiahai.com).
  `,
};

export default dictionary;

export type Dictionary = typeof dictionary;
