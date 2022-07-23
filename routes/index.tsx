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
      <main class={tw`w-10/12 sm:w-96 mx-auto`}>
        <div class={tw`flex flex-col w-full mt-12 mb-28`}>
          <div class={tw`flex flex-col w-full w-full rounded-xl p-4`}>
            <ProfilePicture
              avatar={"https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"}
            />
            <Username username={"@johnsmith"} />
            <Bio
              bio={"At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren."}
            />
            <div class={tw`mb-4 flex flex-row space-x-3`}>
              <CTAButton title={"Contact"} />
              <FollowButton title={"Follow"} />
            </div>
            <Announcement
              title={"My first announcement!"}
              text={"Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."}
            />
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
