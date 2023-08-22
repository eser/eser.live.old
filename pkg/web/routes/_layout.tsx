import { LayoutProps } from "$fresh/server.ts";

export default function App(props: LayoutProps) {
  const { Component } = props;

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the cool lime logo: a sliced lime dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to cool lime</h1>
        <p class="my-4">
          <Component />
        </p>
      </div>
    </div>
  );
}
