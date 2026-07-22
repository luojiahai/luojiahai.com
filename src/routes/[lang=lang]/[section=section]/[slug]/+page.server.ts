import { error } from "@sveltejs/kit";
import QRCode from "qrcode";
import {
  categoriesOf,
  findPost,
  posts,
  postTranslations,
  type Section,
} from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () =>
  posts.map((post) => ({
    lang: post.lang,
    section: post.section,
    slug: post.slug,
  }));

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Language;
  const section = params.section as Section;

  const post = findPost(lang, section, params.slug);
  if (!post) error(404, "Post not found");

  const translations = postTranslations(post)
    .filter((other) => other.lang !== lang)
    .map((other) => ({ lang: other.lang, permalink: other.permalink }));

  const categories = categoriesOf(section)
    .filter((category) => post.categories.includes(category.slug))
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      permalink: category.permalink,
    }));

  // Pre-render the WeChat QR code as inline SVG at build time.
  const wechatQrSvg = post.wechatLink
    ? await QRCode.toString(post.wechatLink, {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 0,
        color: { dark: "#2C2824", light: "#ffffff" },
      })
    : undefined;

  return { section, post, translations, categories, wechatQrSvg };
};
