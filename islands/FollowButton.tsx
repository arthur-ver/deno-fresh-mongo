/** @jsx h */
import { h } from "preact";
import { css, tw } from "@twind";
import { useEffect, useState } from "preact/hooks";

import { Instagram, Linkedin, Twitter, Youtube } from "preact-feather";

export default function FollowButton(props: { title: string }) {
  const [showModal, setShowModal] = useState(false);

  const { title } = props;

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        class={tw
          `bg-blue-700 text-gray-100 font-bold text-sm py-3 px-6 rounded-lg cursor-pointer mt-2`}
      >
        {title}
      </button>
      {showModal &&
        (
          <div class={tw`fixed inset-0 flex justify-center items-center z-10`}>
            <svg width="0" height="0">
              <radialGradient id="ig-gradient" r="150%" cx="30%" cy="107%">
                <stop stop-color="#fdf497" offset="0" />
                <stop stop-color="#fdf497" offset="0.05" />
                <stop stop-color="#fd5949" offset="0.45" />
                <stop stop-color="#d6249f" offset="0.6" />
                <stop stop-color="#285AEB" offset="0.9" />
              </radialGradient>
            </svg>
            <div
              class={tw`opacity-25 fixed inset-0 bg-black`}
              onClick={() => setShowModal(false)}
            >
            </div>
            <div
              class={tw
                `grid gap-2 grid-cols-4 mx-auto bg-white z-20 p-2 rounded-2xl shadow`}
            >
              <a
                class={tw`flex justify-between rounded-xl px-4 py-4`}
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={22} color="#1DA1F2" />
              </a>
              <a
                class={tw`flex justify-between rounded-xl px-4 py-4`}
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={22} color="url(#ig-gradient)" />
              </a>
              <a
                class={tw`flex justify-between rounded-xl px-4 py-4`}
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={22} color="#FF0000" />
              </a>
              <a
                class={tw`flex justify-between rounded-xl px-4 py-4`}
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={22} color="#0A66C2" />
              </a>
            </div>
          </div>
        )}
    </div>
  );
}
