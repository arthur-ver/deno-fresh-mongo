/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function Username(props: { username: string }) {
  const { username } = props;

  return <h1 class={tw`mb-2 font-sans text-2xl font-bold`}>{username}</h1>;
}
