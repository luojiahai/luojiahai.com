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
    // The nav key's accessible name and the page title both read "Posts";
    // the same holds for "Projects".
    posts: "Posts",
    projects: "Projects",
    use: "Use",
    about: "About",
    recentPosts: "Recent posts",
    viewAll: "VIEW ALL",
    postsSubtitle: "Things I write.",
    projectsSubtitle: "Things I build.",
    useSubtitle: "Things I'm using.",
    empty: "Nothing here yet.",
    brandName: "LUOJIAHAI",
    brandTagline: "The sky is not the limit.",
    backToPosts: "‹ BACK TO POSTS",
    allPosts: "‹ ALL POSTS",
    notFoundStatus: "Paper Tray Empty",
    notFoundTitle: "Out of Paper",
    notFoundSubtitle: "Please insert paper correctly to print content.",
    notFoundButton: "← Print Home",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    wechatScanHint: "Scan to read on WeChat",
    shareToX: "SHARE TO X",
    aboutSignOff: "That's about it~",
    skipToContent: "Skip to main content",
    primaryNavigation: "Primary navigation",
    // Offered to a reader of the other language, so it is written in theirs.
    switchLanguage: "切换到中文",
    annLt: "Annunciator lights",
    annLtPositions: {
      test: "Test every light",
      brt: "Bright: light mode",
      dim: "Dim: dark mode",
    },
    annLtFlip: "Flip the annunciator light switch",
    masterWarning: "Master warning: press to acknowledge",
    lastUpdate: "LAST UPDATE",
    entries(count: number) {
      return `${count} ${count === 1 ? "ENTRY" : "ENTRIES"}`;
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
