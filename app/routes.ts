import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/main.tsx"),
  route("/inventory-by-barcode/:id", "routes/inventory-by-barcode/main.tsx"),
  route("/borrowing-request", "routes/borrowing-request/main.tsx"),
  
  route("/login", "routes/auth/main.tsx"),
  
  route("/dashboard", "routes/dashboard/main.tsx"),
  route("/inventory-management/inventories", "routes/inventory-management/inventories/main.tsx"),
  route("/inventory-management/categories", "routes/inventory-management/categories/main.tsx"),
  route("/inventory-management/locations", "routes/inventory-management/locations/main.tsx"),
  route("/inventory-management/suppliers", "routes/inventory-management/suppliers/main.tsx"),
  route("/borrowing", "routes/borrowing/main.tsx"),
] satisfies RouteConfig;