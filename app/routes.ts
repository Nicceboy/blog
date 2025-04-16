import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/robots.txt", "routes/robots.ts"),
  route("/about", "routes/about.tsx"),
  route("/posts/:slug", "routes/posts.tsx"),
  route("/api/posts/", "routes/api/posts.tsx"),
] satisfies RouteConfig;
