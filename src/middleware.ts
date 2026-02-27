// backend/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import { jwtVerify, SignJWT } from "jose";

const ACCESS_COOKIE = "token";
const REFRESH_COOKIE = "refreshToken";

const PUBLIC_ROUTES = ["/login", "/admin/login", "/invite", "/"];
const ADMIN_PREFIX = "/admin";
const ADMIN_API_PREFIX = "/api/admin";
const USER_PREFIX = "/user";

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

async function verifyJWT(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch {
    return null;
  }
}

async function signAccessToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pathname = req.path;

  const accessToken = req.cookies[ACCESS_COOKIE];
  const refreshToken = req.cookies[REFRESH_COOKIE];

  let payload: any = null;

  if (accessToken) {
    payload = await verifyJWT(accessToken, process.env.JWT_SECRET!);
  }

  if (!payload && refreshToken) {
    const refreshPayload = await verifyJWT(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );

    if (refreshPayload) {
      const newAccessToken = await signAccessToken({
        id: refreshPayload.id,
        role: refreshPayload.role,
      });

      res.cookie(ACCESS_COOKIE, newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      (req as any).user = refreshPayload;
      return next();
    } else {
      res.clearCookie(ACCESS_COOKIE);
      res.clearCookie(REFRESH_COOKIE);
      return res.redirect("/login");
    }
  }

  const isAuthenticated = !!payload;
  const isAdmin = payload?.role === "ADMIN";

  if (isPublic(pathname)) return next();

  if (pathname.startsWith(ADMIN_API_PREFIX)) {
    if (!isAuthenticated || !isAdmin) {
      return res.status(401).send("Unauthorized");
    }
    return next();
  }

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!isAuthenticated || !isAdmin) {
      return res.redirect("/admin/login");
    }
    return next();
  }

  if (pathname.startsWith(USER_PREFIX)) {
    if (!isAuthenticated) {
      return res.redirect("/login");
    }
    return next();
  }

  return next();
}
