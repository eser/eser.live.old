import * as functions from "./mod.ts";
import { Router } from "./router.ts";

const router = new Router();

router.add(
  "GET",
  new URLPattern({ pathname: "/" }),
  () => Promise.resolve(),
);

router.add(
  "GET",
  new URLPattern({ pathname: "/profile/:id" }),
  (_req, params) => functions.profileGet(params["id"]!, "tr"),
);

Deno.serve((req: Request) => router.route(req));
