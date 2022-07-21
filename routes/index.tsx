/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";

import { auth0Api } from "../communication/auth0.ts";
import { databaseLoader, DatabaseUser } from "../communication/database.ts";

import { getCookies, setCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    // check for access token cookie
    const maybeAccessToken = getCookies(req.headers)["deploy_access_token"];
    if (maybeAccessToken) {
      const email = await auth0Api.getUserEmail(maybeAccessToken);
      if (email) {
        const postgresDatabase = await databaseLoader.getInstance();
        const user = await postgresDatabase.getUserByEmail(email);
        await postgresDatabase.close();

        return ctx.render(user);
      }
    }

    // oauth callback
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return ctx.render();
    }

    const accessToken = await auth0Api.getAccessToken(code, url.origin);
    const email = await auth0Api.getUserEmail(accessToken);

    const postgresDatabase = await databaseLoader.getInstance();
    const user = await postgresDatabase.getUserByEmail(email);

    if (!user) {
      await postgresDatabase.createUser({
        email,
        username: "",
        avatar_url: "",
      });
    }
    await postgresDatabase.close();

    const response = await ctx.render(user);
    setCookie(response.headers, {
      name: "deploy_access_token",
      value: accessToken,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return response;
  },
};

export default function Home({ data }: PageProps<DatabaseUser>) {
  if (!data) {
    return (
      <div class={tw`flex justify-center items-center flex-col`}>
        <a
          href="/api/login"
          class={tw
            `bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer mt-2`}
        >
          <span>Sign in</span>
        </a>
      </div>
    );
  }

  return (
    <div class={tw`flex justify-center items-center flex-col`}>
      {JSON.stringify(data)}
      <a
        href="/api/logout"
        class={tw
          `bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer mt-2`}
      >
        <span>Logout</span>
      </a>
    </div>
  );
}
