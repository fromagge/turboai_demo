import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const joined = path.join("/");
  const targetPath = `/api/${joined.endsWith("/") ? joined : `${joined}/`}`;
  const url = new URL(targetPath, BACKEND_URL);
  url.search = request.nextUrl.search;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const headers = new Headers();
  headers.set(
    "Content-Type",
    request.headers.get("Content-Type") || "application/json",
  );
  headers.set("Accept", request.headers.get("Accept") || "application/json");
  if (cookieHeader) headers.set("Cookie", cookieHeader);

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const backendResponse = await fetch(url.toString(), {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  backendResponse.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "transfer-encoding") return;
    if (lower === "set-cookie") {
      responseHeaders.append(key, value);
    } else {
      responseHeaders.set(key, value);
    }
  });

  const setCookies = responseHeaders.getSetCookie();
  let loggedInAction: "set" | "clear" | null = null;

  for (const cookie of setCookies) {
    const match = cookie.match(/^access_token=([^;]*)/);
    if (match) {
      loggedInAction = match[1] ? "set" : "clear";
    }
  }

  if (loggedInAction === "set") {
    responseHeaders.append("Set-Cookie", "logged_in=1; Path=/; SameSite=Lax");
  } else if (loggedInAction === "clear") {
    responseHeaders.append(
      "Set-Cookie",
      "logged_in=; Path=/; Max-Age=0; SameSite=Lax",
    );
  }

  const responseBody = await backendResponse.arrayBuffer();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
