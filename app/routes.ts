import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard/main.tsx"),
  route("/assets", "routes/assets/main.tsx"),
  route("/login", "routes/auth/main.tsx")
] satisfies RouteConfig;
