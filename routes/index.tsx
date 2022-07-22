/** @jsx h */
import { h } from "preact";
import { css, tw } from "@twind";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";

import { auth0Api } from "../communication/auth0.ts";
import { databaseLoader, DatabaseUser } from "../communication/database.ts";

import { getCookies, setCookie } from "$std/http/cookie.ts";

import Tabs from "../islands/Tabs.tsx";

import { Star } from "preact-feather";

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
      <div class={tw`w-10/12 sm:w-96 mx-auto`}>
        <div class={tw`flex flex-col w-full mt-12 mb-28`}>
          <div class={tw`flex flex-col w-full w-full rounded-xl p-4`}>
            <div
              class={tw`mb-4 w-28 h-28 rounded-2xl bg-cover ${
                css({
                  "background-image":
                    'url("https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250")',
                })
              }`}
            >
            </div>
            <h1 class={tw`mb-2 font-sans text-2xl font-bold`}>@johnsmith</h1>
            <p class={tw`mb-4 text-gray-500 font-sans text-sm`}>
              At vero eos et accusam et justo duo dolores et ea rebum. Stet
              clita kasd gubergren.
            </p>
            <div class={tw`mb-4 flex flex-row space-x-3`}>
              <button
                class={tw
                  `bg-gray-900 text-gray-100 shadow font-bold text-sm py-3 px-6 rounded-lg cursor-pointer mt-2 ${
                    css({ "flex-grow": "1" })
                  }`}
              >
                Contact
              </button>
              <button
                class={tw
                  `bg-blue-700 text-gray-100 font-bold text-sm py-3 px-6 rounded-lg cursor-pointer mt-2`}
              >
                Follow
              </button>
            </div>
            <div class={tw`bg-purple-100 rounded-2xl px-4 py-4 mb-4`}>
              <div class={tw`flex justify-between space-x-4`}>
                <div class={tw`w-12`}>
                  <Star color={"#968db8"}/>
                </div>
                <div>
                  <h2 class={tw`text-md font-bold text-gray-900 leading-tight mb-1`}>
                    My first announcement!
                  </h2>
                  <p class={tw`text-sm text-gray-600`}>
                    Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                    ipsum dolor sit amet.
                  </p>
                </div>
              </div>
            </div>
            <Tabs />
          </div>
        </div>
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
