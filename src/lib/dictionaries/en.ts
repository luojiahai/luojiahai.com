import { SITE_URL } from "$lib/site-config";
import type { SocialCardKind } from "$lib/social";

interface Contact {
  label: string;
  link: string;
  kind: SocialCardKind;
  /** Set when the label stays Latin in another language, so it keeps en type tokens. */
  lang?: "en";
}

const contacts: Contact[] = [
  {
    label: "X",
    link: "https://x.com/luojiahai",
    kind: "x",
  },
  {
    label: "Instagram",
    link: "https://instagram.com/luojiahai",
    kind: "instagram",
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
];

const dictionary = {
  meta: {
    name: "LUOJIAHAI",
    websiteName: "luojiahai",
    motto: "Hello, World!",
    fillKeywords(keywords?: string[]): string[] {
      return [
        "luojiahai",
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
    use: "/en/about/use",
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
    shareTo: "Share to: ",
    brandName: "LUOJIAHAI",
    brandTagline: "The sky is not the limit.",
    backToPosts: "← BACK TO POSTS",
    backToAbout: "← BACK TO ABOUT",
    allPosts: "← ALL POSTS",
    notFoundStatus: "Paper Tray Empty",
    notFoundTitle: "Out of Paper",
    notFoundSubtitle: "Please insert paper correctly to print content.",
    notFoundButton: "← Print Home",
    notFoundError: "ERR 404 · PAPER_NOT_FOUND",
    printedOn: "Printed on",
    wechatScanHint: "Scan to read on WeChat",
    shareToX: "Share to X",
    aboutSignOff: "That's about it~",
    skipToContent: "Skip to main content",
    primaryNavigation: "Primary navigation",
    // Offered to a reader of the other language, so it is written in theirs.
    switchLanguage: "切换到中文",
    languageDial: "Lang",
    colorModeDial: "Mode",
    powerLamp: "Power",
    colorModes: { system: "System", light: "Light", dark: "Dark" },
    colorMode(mode: string) {
      return `Color mode: ${mode}`;
    },
    lightSwitchOn: "Pull the cord to turn the light on",
    lightSwitchOff: "Pull the cord to turn the light off",
    entries(count: number) {
      return `${count} ${count === 1 ? "entry" : "entries"}`;
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
    emailLabel: "Email",
    emailTo: "To",
  },
};

export default dictionary;

export type Dictionary = typeof dictionary;
