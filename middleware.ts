import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|unauthorized|signin|favicon.ico|robots.txt|images|$).*)",
  ],
};
export default auth((req) => {
  if (!req.auth) {
    const newUrl = new URL("/unauthorized", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
  return NextResponse.next();
});
