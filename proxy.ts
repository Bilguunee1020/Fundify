import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/api/admin/login"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};