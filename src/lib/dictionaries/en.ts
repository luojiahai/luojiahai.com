import { SITE_URL } from "$lib/site-config";
import type { SocialCardKind } from "$lib/social";

interface Contact {
  label: string;
  link: string;
  kind: SocialCardKind;
}

const contacts: Contact[] = [
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
    label: "Email",
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
];

const dictionary = {
  meta: {
    name: "Luo, Jiahai",
    websiteName: "luojiahai",
    motto: "Hello, World!",
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
      )}&url=${encodeURIComponent(`${SITE_URL}${postLink}`)}`;
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
    empty: "Nothing here yet.",
    brandName: "LUOJIAHAI",
    brandTagline: "The sky is not the limit.",
    backToPosts: "← BACK TO POSTS",
    // The 404 page reads as an ECAM warning: a red system + title, then the
    // procedure lines in cyan.
    notFoundSystem: "NAV",
    notFoundTitle: "Page not found",
    notFoundSteps: {
      home: ["HOME", "PRESS"],
      posts: ["POSTS", "CHECK"],
      url: ["URL", "VERIFY"],
    },
    notFoundAck: "Press MASTER WARN to acknowledge",
    notFoundAcked: "Warning acknowledged · follow procedure",
    notFoundButton: "◂ Return home",
    masterWarn: "Master warning: press to acknowledge",
    profile: "Profile",
    viewAllProjects: "All projects ▸",
    viewAllPosts: "All posts ▸",
    displaySections: "Display sections",
    postFilter: "Filter posts by category",
    allCategories: "All",
    filterSummary(name: string, count: number) {
      return `Filter ${name} · ${count} ${count === 1 ? "entry" : "entries"}`;
    },
    contents: "Contents",
    keywords: "Keywords",
    updated: "Updated",
    readingTime(minutes: number) {
      return `~${minutes} min read`;
    },
    readingProgress: "Reading progress",
    projectsHint: "Point at a project to fly direct to it.",
    projectMap: "Project map",
    openProject: "Open",
    wechatScanHint: "Scan to read on WeChat",
    shareToX: "Share to X",
    aboutSignOff: "That's about it~",
    skipToContent: "Skip to main content",
    primaryNavigation: "Primary navigation",
    // Offered to a reader of the other language, so it is written in theirs.
    switchLanguage: "切换到中文",
    colorModes: { system: "System", light: "Light", dark: "Dark" },
    colorMode(mode: string) {
      return `Color mode: ${mode}`;
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
};

export default dictionary;

export type Dictionary = typeof dictionary;
