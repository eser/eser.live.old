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
- [Supabase](https://supabase.io)

For Backend:

- [Supabase](https://supabase.io)
- [Prisma](https://prisma.io)

Prerequisites:

- [Deno](https://deno.land) (recommended v1.35.2)
- [Git](https://git-scm.com/) (recommended v2.41.0)

## Setting Up the Project

Clone the GitHub repository:

```bash
$ git clone git@github.com:eser/eser.live.git
```

Navigate to the project directory:

```bash
$ cd eser.live
```

Install necessary packages:

```bash
$ pnpm install
```

Go to the API folder and configure Supabase:

```bash
$ cd packages/api
$ pnpx supabase start

Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: aaa.bbb.ccc_ddd0
service_role key: xxx.yyy.zzz-www
```

Copy the `.env` files in both `packages/api` and `packages/web` directories as
`.env.local` and make the necessary changes.

While you're still in `packages/api` directory, initialize the database and load
some example data:

```bash
$ pnpm db:generate
$ pnpm db:push
$ pnpm db:seed
```

Lastly, go back to project root and start project in development mode:

```bash
$ cd ../..
$ pnpm dev
```

## Project Management

Currently, we do not have a management panel for the project. For this reason,
we perform operations through the CLI. If `deno` is installed on your system,
you can access the CLI through the following commands:

```bash
$ cd packages/api
$ deno task cli
```

You can access `env` and `supabase` objects through the CLI.

### Examples:

Getting a profile:

```js
await profileGet(supabase, "eser", "tr");
```

## How to Contribute

We welcome contributions from everyone. To start please
[read our contributing guide](CONTRIBUTING.en.md). If you want to help you can
check out our [issues](https://github.com/eser/eser.live/issues). If you
have any questions and/or stuck at any point, feel free to ask for help on
GitHub Issues.

## License

Apache 2.0, see [LICENSE](LICENSE) file for details.
