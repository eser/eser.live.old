import { LayoutProps } from "$fresh/server.ts";

export default function App(props: LayoutProps) {
  const { Component } = props;

  return (
    <div className="px-4 py-8 mx-auto bg-[#86efac]">
      <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          className="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the cool lime logo: a sliced lime dripping with juice"
        />
        <h1 className="text-4xl font-bold">Welcome to cool lime</h1>
        <p className="my-4">
          <Component />
        </p>
      </div>
    </div>
  );
}
