import type { APIRoute } from "astro";
import {
	confirmSubscriber,
	verifyConfirmationToken,
} from "../../lib/newsletter";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
	try {
		const token = url.searchParams.get("token") ?? "";
		const email = token.length > 0 ? verifyConfirmationToken(token) : null;

		if (!email) {
			return html(page(false));
		}

		await confirmSubscriber(email);
		return html(page(true));
	} catch (error) {
		console.error("confirm error:", error);
		const detail = error instanceof Error ? error.message : String(error);
		return html(page(false, detail));
	}
};

function page(ok: boolean, detail?: string): string {
	const body = ok
		? `<h1>you're in</h1>
		   <p>your subscription is confirmed. thanks for reading.</p>`
		: detail
			? `<h1>something went wrong</h1>
			   <p style="color: #b00">${detail}</p>`
			: `<h1>link expired</h1>
			   <p>this confirmation link is invalid or has expired. try subscribing again.</p>`;
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<title>newsletter</title>
	</head>
	<body style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 6rem auto; padding: 0 1rem; line-height: 1.6">
		${body}
		<p><a href="/">back home</a></p>
	</body>
</html>`;
}

function html(content: string): Response {
	return new Response(content, {
		headers: { "Content-Type": "text/html; charset=utf-8" },
	});
}
