import type { IconName } from "$lib/icons";
import type { AircraftSlug } from "../../params/aircraft";

interface Contact {
  label: string;
  name: string;
  link: string;
  icon: IconName;
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
    wechatScanHint: "Scan to read on WeChat",
    entries(count: number) {
      return `${count} ${count === 1 ? "entry" : "entries"}`;
    },
    icon(label: string) {
      return `Icon for ${label}`;
    },
  },
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
};

export default dictionary;

export type Dictionary = typeof dictionary;
