import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/posts/posts.tsx"),
  route("/robots.txt", "routes/robots.ts"),
  route("/about", "routes/about.tsx"),
  route("/posts/:slug", "routes/posts/post.tsx"),
  route("/api/posts/", "routes/posts/api.ts"),
] satisfies RouteConfig;
