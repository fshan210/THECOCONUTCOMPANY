import "server-only";

type RecaptchaResult = {
  ok: boolean;
  skipped?: boolean;
  score?: number;
  message?: string;
};

export async function verifyRecaptchaToken(token: string | undefined, expectedAction: string): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true, message: "reCAPTCHA is not configured." };
  if (!token) return { ok: false, message: "Security check is missing. Refresh and try again." };

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token })
  });

  const result = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  if (!result.success) return { ok: false, score: result.score, message: "Security check failed. Please try again." };
  if (result.action && result.action !== expectedAction) return { ok: false, score: result.score, message: "Security check action mismatch." };
  if (typeof result.score === "number" && result.score < 0.45) return { ok: false, score: result.score, message: "Security check could not verify this request." };
  return { ok: true, score: result.score };
}
