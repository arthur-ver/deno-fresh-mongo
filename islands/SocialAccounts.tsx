/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { Instagram, Linkedin, Twitter, Youtube } from "preact-feather";

import { UserSchema } from "../communication/database.ts";

export default function SocialAccounts(
  props: { socialAccounts: UserSchema["socialAccounts"] },
) {
  const { socialAccounts } = props;

  return (
    <div>
      <div
        class={tw`flex justify-center mb-6`}
      >
        {socialAccounts?.twitter && (
          <a
            class={tw`rounded-xl px-3`}
            href={socialAccounts.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={22} color="#1DA1F2" />
          </a>
        )}
        {socialAccounts?.instagram && (
          <a
            class={tw`rounded-xl px-3`}
            href={socialAccounts.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={22} color="url(#ig-gradient)" />
          </a>
        )}
        {socialAccounts?.youtube && (
          <a
            class={tw`rounded-xl px-3`}
            href={socialAccounts.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={22} color="#FF0000" />
          </a>
        )}
        {socialAccounts?.linkedin && (
          <a
            class={tw`rounded-xl px-3`}
            href={socialAccounts.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={22} color="#0A66C2" />
          </a>
        )}
      </div>
      <svg width="0" height="0">
        <radialGradient id="ig-gradient" r="150%" cx="30%" cy="107%">
          <stop stop-color="#fdf497" offset="0" />
          <stop stop-color="#fdf497" offset="0.05" />
          <stop stop-color="#fd5949" offset="0.45" />
          <stop stop-color="#d6249f" offset="0.6" />
          <stop stop-color="#285AEB" offset="0.9" />
        </radialGradient>
      </svg>
    </div>
  );
}
