/**
 * Send the newsletter to all confirmed subscribers.
 *
 * The list lives in the `subscribers` table of your Supabase Postgres db
 * (see supabase/schema.sql for the schema).
 *
 * Usage:
 *   node --env-file=.env scripts/send-newsletter.mjs [content-file]
 *
 * content-file defaults to newsletter/current.html. The template supports
 * these placeholders:
 *   {{LATEST_POST_TITLE}}  - title of the newest post in src/content/blog
 *   {{LATEST_POST_URL}}    - its URL
 *   {{SITE_URL}}           - your site URL
 *   {{UNSUBSCRIBE}}        - each subscriber's unsubscribe link
 * Subject defaults to the NEWSLETTER_SUBJECT env var, or a generic fallback.
 *
 * Sends one email per subscriber (free tier, counts toward your monthly
 * quota). The paid Resend "broadcast" feature is intentionally not used.
 *
 * Requires env vars: RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * NEWSLETTER_FROM, SITE_URL.
 */
import { readdir, readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function requireEnv(name) {
	const value = process.env[name];
	if (!value) {
		console.error(`missing env var: ${name}`);
		process.exit(1);
	}
	return value;
}

function escapeHtml(str) {
	return str
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

/** Finds the newest post in src/content/blog by frontmatter date. */
async function latestPost() {
	const dir = "src/content/blog";
	let entries;
	try {
		entries = await readdir(dir);
	} catch {
		console.error(`cannot read ${dir}, run from the project root`);
		process.exit(1);
	}

	const posts = [];
	for (const file of entries) {
		if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
		const content = await readFile(`${dir}/${file}`, "utf8");
		const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
		const unquote = (s) => s?.trim().replace(/^["']|["']$/g, "");
		const title = unquote(fm.match(/^title:\s*(.+)$/m)?.[1]);
		const date = unquote(fm.match(/^date:\s*(.+)$/m)?.[1]);
		if (!title || !date) continue;
		posts.push({
			title,
			date,
			slug: file.replace(/\.(mdx?|md)$/, ""),
		});
	}

	posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
	return posts[0] ?? null;
}

const apiKey = requireEnv("RESEND_API_KEY");
const supabaseUrl = requireEnv("SUPABASE_URL");
const supabaseKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const from = requireEnv("NEWSLETTER_FROM");
const siteUrl = requireEnv("SITE_URL");
const subject = process.env.NEWSLETTER_SUBJECT ?? "new post from oliver";

const contentPath = process.argv[2] ?? "newsletter/current.html";
const template = await readFile(contentPath, "utf8");

const post = await latestPost();
const postUrl = post ? `${siteUrl}/blog/${post.slug}` : `${siteUrl}/blog`;
const postTitle = post ? escapeHtml(post.title) : "latest post";

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(apiKey);

const { data, error } = await supabase.from("subscribers").select("email");
if (error) {
	console.error("failed to load subscribers:", error.message);
	process.exit(1);
}
const subscribers = data ?? [];

if (subscribers.length === 0) {
	console.log("no confirmed subscribers, nothing to send");
	process.exit(0);
}

console.log(`sending to ${subscribers.length} subscriber(s)...`);
let sent = 0;
let failed = 0;

for (const subscriber of subscribers) {
	const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
	const html = template
		.replaceAll("{{LATEST_POST_TITLE}}", postTitle)
		.replaceAll("{{LATEST_POST_URL}}", postUrl)
		.replaceAll("{{SITE_URL}}", siteUrl)
		.replaceAll(
			"{{UNSUBSCRIBE}}",
			`<p style="font-size: 12px; color: #878580">
				<a href="${unsubscribeUrl}" style="color: #878580; text-decoration: underline">unsubscribe</a>
			</p>`,
		);

	try {
		const { error } = await resend.emails.send({
			from,
			to: [subscriber.email],
			subject,
			html,
			headers: {
				"List-Unsubscribe": `<${unsubscribeUrl}>`,
			},
		});
		if (error) throw new Error(error.message);
		sent++;
	} catch (error) {
		failed++;
		console.error(`failed for ${subscriber.email}:`, error.message ?? error);
	}
}

console.log(`done: ${sent} sent, ${failed} failed`);
