/**
 * Cloudflare Worker: dgroupnepal.com → dgroupeducation.com (301 permanent redirect)
 *
 * Preserves full path + query string:
 *   http://dgroupnepal.com/about?ref=google  →  https://dgroupeducation.com/about?ref=google
 *   http://www.dgroupnepal.com/              →  https://dgroupeducation.com/
 */

const TARGET = "dgroupeducation.com";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Force HTTPS + swap hostname, preserve everything else
    url.protocol = "https:";
    url.hostname = TARGET;
    url.port = "";

    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        "Cache-Control": "public, max-age=31536000",
        "X-Redirect-By": "dgroupnepal-redirect-worker",
      },
    });
  },
} satisfies ExportedHandler;
