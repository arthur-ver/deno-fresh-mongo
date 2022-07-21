/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { HandlerContext } from "$fresh/server.ts";

import { databaseLoader } from "../communication/database.ts";

export async function handler(
    req: Request,
    ctx: HandlerContext,
): Promise<Response> {

  const postgresDatabase = await databaseLoader.getInstance();
  const results = await postgresDatabase.allPhotos();

  await postgresDatabase.close();

  console.log(results);

  const response = await ctx.render();
  return response;
}

export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>Hello World!</div>
  );
}