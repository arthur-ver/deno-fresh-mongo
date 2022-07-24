/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";

import {
  database,
  LinkSchema,
  UpdateSchema,
  UserSchema,
} from "../communication/database.ts";

import ProfilePicture from "../islands/ProfilePicture.tsx";
import Username from "../islands/Username.tsx";
import Bio from "../islands/Bio.tsx";
import CTAButton from "../islands/CTAButton.tsx";
import FollowButton from "../islands/FollowButton.tsx";
import Announcement from "../islands/Announcement.tsx";
import Tabs from "../islands/Tabs.tsx";

interface UserData {
  user: UserSchema;
  links: LinkSchema[];
  updates: UpdateSchema[];
}

export const handler: Handlers<UserData | null> = {
  async GET(_, ctx) {
    const { username } = ctx.params;

    const user = await database.getUser({ username });
    const links = await database.getLinks(user.linksList);
    const updates = await database.getUpdates(user.updatesList);

    if (!user) {
      return ctx.render(null);
    }

    return ctx.render({ user, links, updates });
  },
};

export default function GreetPage({ data }: PageProps<UserData | null>) {
  if (!data) {
    return <h1>404</h1>;
  }

  const { user, links, updates } = data;
  const { avatar, bio, username, announcement } = user;

  return (
    <main class={tw`w-10/12 sm:w-96 mx-auto`}>
      <div class={tw`flex flex-col w-full mt-12 mb-28`}>
        <div class={tw`flex flex-col w-full w-full rounded-xl p-4`}>
          <ProfilePicture
            avatar={avatar}
          />
          <Username username={`@${username}`} />
          <Bio
            bio={bio}
          />
          <div class={tw`mb-4 flex flex-row space-x-3`}>
            <CTAButton title={"Contact"} />
            <FollowButton title={"Follow"} />
          </div>
          {announcement &&
            (
              <Announcement
                title={announcement.title}
                text={announcement.text}
              />
            )}
          <Tabs links={links} updates={updates} />
        </div>
      </div>
    </main>
  );
}
