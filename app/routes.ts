import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard/main.tsx"),

  route("/login", "routes/auth/main.tsx"),

  // Dashboard route
  // route("/dashboard", "routes/dashboard/main.tsx"),
  route("/inventory-management/inventories", "routes/inventory-management/inventories/main.tsx"),
  route("/inventory-management/categories", "routes/inventory-management/categories/main.tsx"),
  route("/inventory-management/locations", "routes/inventory-management/locations/main.tsx"),
  route("/inventory-management/suppliers", "routes/inventory-management/suppliers/main.tsx"),
  route("/borrowing", "routes/borrowing/main.tsx"),
] satisfies RouteConfig;