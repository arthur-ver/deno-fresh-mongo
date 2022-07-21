import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req: Request): Response {
    const url = new URL(`${Deno.env.get("AUTH_DOMAIN")}/authorize`);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", Deno.env.get("AUTH_CLIENT_ID") || "");
    url.searchParams.set("redirect_uri", new URL(req.url).origin);
    url.searchParams.set("scope", "openid email");
    return Response.redirect(url, 302);
  },
};
