/** @jsx h */
import { h } from "preact";
import { css, tw } from "@twind";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";

import { auth0Api } from "../communication/auth0.ts";
import { database } from "../communication/database.ts";

import { getCookies, setCookie } from "$std/http/cookie.ts";

import ProfilePicture from "../islands/ProfilePicture.tsx";
import Username from "../islands/Username.tsx";
import Bio from "../islands/Bio.tsx";
import CTAButton from "../islands/CTAButton.tsx";
import FollowButton from "../islands/FollowButton.tsx";
import Announcement from "../islands/Announcement.tsx";

import Tabs from "../islands/Tabs.tsx";

import { LogIn } from "preact-feather";

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    // check for access token cookie
    const maybeAccessToken = getCookies(req.headers)["deploy_access_token"];
    if (maybeAccessToken) {
      const email = await auth0Api.getUserEmail(maybeAccessToken);
      if (email) {
        const user = await database.getUser({ email });
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

    let user = await database.getUser({ email });

    if (!user) {
      const _id = await database.createUser(email);
      user = await database.getUser({ _id });
    }

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

export default function Home({ data }: PageProps) {
  if (!data) {
    return (
      <main
        class={tw
          `w-10/12 sm:w-96 mx-auto flex flex-col items-center bg-green-100 mt-28 px-2 pt-16 pb-6 rounded-3xl`}
      >
        <h1 class={tw`font-serif text-4xl text-center`}>
          A front page to your corner of the internet.
        </h1>
        <img src="./character_vector_1.svg" />
        <a href="/api/login" class={tw`w-5/6`}>
          <div
            class={tw
              `font-serif flex items-center justify-center space-x-2 bg-blue-700 text-gray-100 font-bold text-sm py-3 pl-6 pr-4 rounded-full cursor-pointer mt-2 hover:bg-blue-800 hover:shadow transition duration-150 ease-in-out`}
          >
            <span class={tw`text-xl font-light`}>Sign in</span>
          </div>
        </a>
      </main>
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
