export type CallbackHandler<T> = (
  request: Request,
  params: Record<string, string | undefined>,
) => Promise<T>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Route = {
  method: HttpMethod;
  pattern: URLPattern;
  handler: CallbackHandler<unknown>;
};

export class Router {
  routes: Array<Route> = [];

  add(
    method: HttpMethod,
    pattern: URLPattern,
    handler: CallbackHandler<unknown>,
  ) {
    this.routes.push({
      method,
      pattern,
      handler,
    });
  }

  async route(request: Request): Promise<Response> {
    for (const route of this.routes) {
      if (route.method !== request.method) {
        continue;
      }

      const match = route.pattern.exec(request.url);

      if (match !== null) {
        const { pathname } = new URL(request.url);

        console.log(
          `[${request.method} ${pathname}] Matched ${route.method} ${route.pattern.pathname}`,
        );

        const result = await route.handler(request, match.pathname.groups);
        const output = (result === undefined) ? "" : JSON.stringify(result);

        return new Response(output, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    console.log(`[${request.method} ${request.url}] Match not found`);

    return new Response("Not Found", { status: 404 });
  }
}
