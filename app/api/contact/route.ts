import { Resend } from "resend";

import { CONTACT_STEPS, missingRequired } from "@/lib/terminal/contact";

import type { ContactAnswers, ContactKey } from "@/lib/terminal/contact";

export const runtime = "nodejs";

const TO = "kevin@nare.li";
const FROM = "portfolio <contact@nare.li>";
const MAX_FIELD = 4000;

/**
 * Best-effort per-IP throttle. Serverless instances are not shared, so this
 * slows a single client hammering one instance rather than acting as a real
 * global limit — a speed bump, not a guarantee.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  // Strip control characters so nothing can forge headers or break the body.
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, MAX_FIELD);
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json(
      { error: "The mail service is not configured on this deployment." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many messages in a short window. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Honeypot: a real client never fills this in, so anything here is a bot.
  // Answer 200 so it cannot tell it was caught.
  if (clean(raw.website)) return Response.json({ ok: true });

  const answers: ContactAnswers = {};
  for (const step of CONTACT_STEPS) {
    const v = clean(raw[step.key]);
    if (v) answers[step.key] = v;
  }

  const missing = missingRequired(answers);
  if (missing.length) {
    return Response.json(
      { error: `Missing: ${missing.join(", ")}` },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(answers.email ?? "")) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  const label = (k: ContactKey) => {
    const s = CONTACT_STEPS.find((x) => x.key === k);
    return s ? (s.kind === "choice" ? s.group : s.label) : k;
  };

  const text = CONTACT_STEPS.filter((s) => answers[s.key])
    .map((s) => `${label(s.key).padEnd(10)} ${answers[s.key]}`)
    .join("\n");

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: answers.email,
      subject: `Portfolio · ${answers.project ?? "enquiry"} · ${answers.name ?? "someone"}`,
      text: `${text}\n\n--\nSent from the portfolio shell.`,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return Response.json(
        { error: "The mail service refused the message. Try again shortly." },
        { status: 502 },
      );
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[contact] send failed", e);
    return Response.json(
      { error: "Could not send just now. Email kevin@nare.li directly." },
      { status: 502 },
    );
  }
}
