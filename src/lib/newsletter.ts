import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

function siteUrl(): string {
	return (
		(import.meta.env.SITE_URL as string | undefined) ??
		(import.meta.env.SITE as string | undefined) ??
		"http://localhost:4321"
	);
}

// --- signed confirmation links (stateless, no storage needed) ---

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hmacSecret(): string {
	const s = import.meta.env.NEWSLETTER_SECRET as string | undefined;
	if (!s) throw new Error("newsletter: set NEWSLETTER_SECRET");
	return s;
}

/** Creates a signed token containing the email, valid for 24h. */
export function createConfirmationToken(email: string): string {
	const expires = Date.now() + TOKEN_TTL_MS;
	const payload = `${normalizeEmail(email)}:${expires}`;
	const sig = createHmac("sha256", hmacSecret()).update(payload).digest("hex");
	return `${payload}:${sig}`;
}

/** Returns the email if the token is valid and unexpired, otherwise null. */
export function verifyConfirmationToken(token: string): string | null {
	const parts = token.split(":");
	if (parts.length !== 3) return null;
	const [email, expiresRaw, sig] = parts;
	if (!isValidEmail(email) || !/^\d+$/.test(expiresRaw)) return null;

	const expected = createHmac("sha256", hmacSecret())
		.update(`${email}:${expiresRaw}`)
		.digest("hex");
	if (sig.length !== expected.length) return null;
	if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
	if (Number(expiresRaw) < Date.now()) return null;

	return email;
}

// --- subscriber list, stored in a Supabase Postgres table ---
// schema in supabase/schema.sql

function supabase() {
	const url = import.meta.env.SUPABASE_URL as string | undefined;
	const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY as string | undefined;
	if (!url || !key) {
		throw new Error(
			"newsletter: set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY",
		);
	}
	return createClient(url, key);
}

/** Adds the subscriber to the list (idempotent by email). */
export async function confirmSubscriber(email: string): Promise<void> {
	const { error } = await supabase()
		.from("subscribers")
		.upsert({ email: normalizeEmail(email) }, { onConflict: "email" });
	if (error) throw new Error(error.message);
}

/** Removes a subscriber. Returns false if they weren't on the list. */
export async function unsubscribe(email: string): Promise<boolean> {
	const { error, count } = await supabase()
		.from("subscribers")
		.delete({ count: "exact" })
		.eq("email", normalizeEmail(email));
	if (error) throw new Error(error.message);
	return (count ?? 0) > 0;
}

export async function sendConfirmationEmail(
	email: string,
	token: string,
): Promise<void> {
	const apiKey = import.meta.env.RESEND_API_KEY as string | undefined;
	if (!apiKey) throw new Error("newsletter: set RESEND_API_KEY");

	const resend = new Resend(apiKey);
	const confirmUrl = `${siteUrl()}/api/confirm?token=${encodeURIComponent(token)}`;

	const { error } = await resend.emails.send({
		from:
			(import.meta.env.NEWSLETTER_FROM as string | undefined) ??
			"onboarding@resend.dev",
		to: [email],
		subject: "confirm your newsletter subscription",
		html: `
			<h1>almost there</h1>
			<p>click the link below to confirm your subscription:</p>
			<p><a href="${confirmUrl}">confirm subscription</a></p>
			<p>if you didn't sign up for this, you can ignore this email.</p>
		`,
	});
	if (error) throw new Error(error.message);
}
