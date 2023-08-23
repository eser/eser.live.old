# eser.live

[![GitHub issues](https://img.shields.io/github/issues/eser/eser.live)](https://github.com/eser/eser.live/issues)

(For Turkish please click [here](README.md))

## Project Description

Not ready yet.

## Technology

These are the technologies we use to build our projects:

For Frontend:

- [Fresh](https://fresh.deno.dev)
- [Shadcn](https://shadcn/ui)
- [PostCSS](https://postcss.org)

For Backend:

- [Deno](https://deno.com)
- [Deno KV](https://deno.com/kv)

Prerequisites:

- [Deno](https://deno.land) (recommended v1.36.2)
- [Git](https://git-scm.com) (recommended v2.41.0)
- [Pup](https://github.com/Hexagon/pup) (recommended v1.0.0-rc.7)

## Setting Up the Project

Clone the GitHub repository:

```bash
$ git clone git@github.com:eser/eser.live.git
```

Navigate to the project directory:

```bash
$ cd eser.live
```

Finish configuring the project:

Copy the `.env` files in both `pkg/api` and `pkg/web` directories as
`.env.local` and make the necessary changes.

While you're still in `pkg/api` directory, initialize the database and load some
example data:

```bash
$ deno task generate
```

Lastly, go back to project root and start project in development mode:

```bash
$ pup start
```

## Project Management

Currently, we do not have a management panel for the project. For this reason,
we perform operations through the CLI. If `deno` is installed on your system,
you can access the CLI through the following commands:

```bash
$ deno task api:cli
```

You can access predefined objects such as `env`, `seed`, `profileGet`, etc.
through the CLI.

### Examples:

Getting a profile:

```js
await profileGet("eser", "tr");
```

## How to Contribute

We welcome contributions from everyone. To start please
[read our contributing guide](CONTRIBUTING.en.md). If you want to help you can
check out our [issues](https://github.com/eser/eser.live/issues). If you have
any questions and/or stuck at any point, feel free to ask for help on GitHub
Issues.

## License

Apache 2.0, see [LICENSE](LICENSE) file for details.
