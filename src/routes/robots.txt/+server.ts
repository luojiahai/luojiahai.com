import type { RequestHandler } from "./$types";

export const prerender = true;

const BASE_URL = "https://luojiahai.com";

export const GET: RequestHandler = () => {
  const content = `User-Agent: *
Allow: /

Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
