export const privateNoStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  Expires: "0"
} as const;

function requestOrigin(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function isSameOriginMutation(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const requestUrl = new URL(request.url);
  // Next may normalize request.url to its internal host. Host is the browser-facing
  // request authority; forwarded host headers must not expand this boundary.
  const host = request.headers.get("host");
  const expected = host ? requestOrigin(`${requestUrl.protocol}//${host}`) : requestUrl.origin;
  if (!expected) return false;
  const origin = request.headers.get("origin");
  if (origin) return expected === requestOrigin(origin);
  return expected === requestOrigin(request.headers.get("referer"));
}

export type JsonReadResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 | 415; message: string };

export async function readBoundedJson(request: Request, maxBytes = 8_192): Promise<JsonReadResult> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") return { ok: false, status: 415, message: "This endpoint accepts JSON only." };
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(declaredLength) || declaredLength < 0) return { ok: false, status: 400, message: "The request body is invalid." };
  if (declaredLength > maxBytes) return { ok: false, status: 413, message: "This request is too large." };
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, status: 400, message: "The request body is invalid." };
  const bytes = new Uint8Array(maxBytes);
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (length + value.byteLength > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413, message: "This request is too large." };
      }
      bytes.set(value, length);
      length += value.byteLength;
    }
  } catch {
    return { ok: false, status: 400, message: "The request body is invalid." };
  }
  try {
    return { ok: true, value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length))) };
  } catch {
    return { ok: false, status: 400, message: "The request body is invalid." };
  }
}
