import { AppProps } from "$cool/lime/server.ts";

export default function App(props: AppProps) {
  const { Component } = props;

  return (
    <html lang="en">
      <head>
        <title>Cool lime app</title>

        <link rel="stylesheet" href="/assets/globals.css" />
        <link rel="stylesheet" href="/assets/layout.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
