import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  const { Component } = props;

  return (
    <html lang="en">
      <head>
        <title>My Fresh App</title>

        <link rel="stylesheet" href="/assets/globals.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
