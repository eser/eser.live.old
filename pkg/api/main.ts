import { profileGet } from "@api/functions/profile-get/mod.ts";
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
  (_req, params) => profileGet(params.id!, "tr"),
);

Deno.serve((req: Request) => router.route(req));
