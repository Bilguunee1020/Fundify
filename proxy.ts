import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/api/admin/login", "/api/test-db"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};