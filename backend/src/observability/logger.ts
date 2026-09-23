const sensitiveKey = /(password|passcode|otp|token|authorization|cookie|private.?key|secret|credential|csrf|card)/i;

export function sanitizeForLog(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeForLog);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sensitiveKey.test(key) ? "[REDACTED]" : sanitizeForLog(item)
      ])
    );
  }
  return value;
}

export function logInfo(message: string, data: Record<string, unknown> = {}) {
  console.info(JSON.stringify({ level: "info", message, ...(sanitizeForLog(data) as Record<string, unknown>) }));
}

export function logWarn(message: string, data: Record<string, unknown> = {}) {
  console.warn(JSON.stringify({ level: "warn", message, ...(sanitizeForLog(data) as Record<string, unknown>) }));
}

export function logError(message: string, data: Record<string, unknown> = {}) {
  console.error(JSON.stringify({ level: "error", message, ...(sanitizeForLog(data) as Record<string, unknown>) }));
}
