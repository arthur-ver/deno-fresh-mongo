import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req: Request): Response {
    const headers = new Headers({
      "location": new URL(req.url).origin,
    });
    deleteCookie(headers, "deploy_access_token", { path: "/" });
    return new Response(null, { status: 302, headers });
  },
};
