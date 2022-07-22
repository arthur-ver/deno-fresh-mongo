/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useEffect, useState } from "preact/hooks";

export default function Tabs(props: any) {
  const [openTab, setOpenTab] = useState(1);

  return (
    <div class={tw`flex flex-wrap`}>
      <div class={tw`w-full`}>
        <ul
          class={tw
            `flex bg-gray-100 mb-0 list-none flex-wrap px-1 py-1 flex-row rounded-xl`}
          role="tablist"
        >
          <li class={tw`-mb-px mr-2 last:mr-0 flex-auto text-center`}>
            <a
              class={tw
                `rounded-lg text-xs font-bold px-1 py-1 block leading-normal ${
                  openTab === 1
                    ? "text-gray-900 shadow bg-white"
                    : "text-gray-600"
                }`}
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              href="#"
              role="tablist"
            >
              News
            </a>
          </li>
          <li class={tw`-mb-px mr-2 last:mr-0 flex-auto text-center`}>
            <a
              class={tw
                `rounded-lg text-xs font-bold px-1 py-1 block leading-normal ${
                  openTab === 2
                    ? "text-gray-900 shadow bg-white"
                    : "text-gray-600"
                }`}
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(2);
              }}
              data-toggle="tab"
              href="#"
              role="tablist"
            >
              Links
            </a>
          </li>
        </ul>
        <div class={tw`relative mt-4 flex flex-col bg-white w-full`}>
          <div class={tw`flex-auto`}>
            <div class={tw`tab-content tab-space`}>
              <div class={tw`${openTab === 1 ? "block" : "hidden"}`}>
                <div class={tw`bg-purple-100 rounded-2xl px-4 py-4`}>
                  <h2 class={tw`text-md font-bold mb-1 text-gray-900`}>
                    My first announcement!
                  </h2>
                  <p class={tw`text-sm text-gray-600`}>
                    Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                    ipsum dolor sit amet.
                  </p>
                </div>
              </div>
              <div class={tw`${openTab === 2 ? "block" : "hidden"}`}>
                <p>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
