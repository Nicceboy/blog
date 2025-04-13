import { index, route, type RouteConfig } from "@react-router/dev/routes";
// import { robotsLoader } from "./routes/robots.tsx";

// Combine main routes with utility routes
export default [
  index("routes/home.tsx"),
  route("robots.txt", "routes/robots.tsx"),
  route("/about", "routes/about.tsx"),
] satisfies RouteConfig;
