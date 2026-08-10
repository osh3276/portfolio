import type { APIRoute } from "astro";
import { unsubscribe } from "../../lib/newsletter";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
	const email = url.searchParams.get("email") ?? "";

	let ok = false;
	let detail: string | undefined;
	if (email.length > 0) {
		try {
			ok = await unsubscribe(email);
		} catch (error) {
			console.error("unsubscribe error:", error);
			detail = error instanceof Error ? error.message : String(error);
		}
	}

	return new Response(page(ok, detail), {
		headers: { "Content-Type": "text/html; charset=utf-8" },
	});
};

function page(ok: boolean, detail?: string): string {
	const body = ok
		? `<h1>unsubscribed</h1>
		   <p>you've been removed from the list. sorry to see you go.</p>`
		: detail
			? `<h1>something went wrong</h1>
			   <p style="color: #b00">${detail}</p>`
			: `<h1>not on the list</h1>
			   <p>that email wasn't subscribed, so there's nothing to do.</p>`;
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
