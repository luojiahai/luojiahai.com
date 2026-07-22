const BASE_URL = "https://luojiahai.com";

export interface JsonLdWebSite {
  name: string;
  alternateName?: string;
  url: string;
  description: string;
}

export function generateWebSiteJsonLd(options: JsonLdWebSite): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: options.name,
    ...(options.alternateName
      ? { alternateName: options.alternateName }
      : {}),
    url: options.url,
    description: options.description,
    publisher: {
      "@type": "Person",
      name: "Luo, Jiahai",
      url: BASE_URL,
      sameAs: [
        "https://x.com/luojiahai",
        "https://github.com/luojiahai",
        "https://linkedin.com/in/luojiahai",
        "https://instagram.com/luojiahai",
      ],
    },
  };
}

export interface JsonLdBlogPosting {
  title: string;
  description?: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  categories?: string[];
  lang: string;
}

export function generateBlogPostingJsonLd(
  options: JsonLdBlogPosting,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    ...(options.description ? { description: options.description } : {}),
    url: options.url,
    datePublished: options.datePublished,
    ...(options.dateModified
      ? { dateModified: options.dateModified }
      : { dateModified: options.datePublished }),
    ...(options.image
      ? { image: options.image }
      : {}),
    inLanguage: options.lang,
    ...(options.categories?.length
      ? { keywords: options.categories.join(", ") }
      : {}),
    author: {
      "@type": "Person",
      name: "Luo, Jiahai",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Luo, Jiahai",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
  };
}

export interface JsonLdBreadcrumb {
  items: { name: string; url: string }[];
}

export function generateBreadcrumbJsonLd(
  options: JsonLdBreadcrumb,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: options.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
