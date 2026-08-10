import type { APIRoute } from "astro";
import {
	createConfirmationToken,
	isValidEmail,
	sendConfirmationEmail,
} from "../../lib/newsletter";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const email = typeof body?.email === "string" ? body.email : "";

		if (!isValidEmail(email)) {
			return json(
				{ ok: false, message: "that email doesn't look right" },
				400,
			);
		}

		const token = createConfirmationToken(email);
		await sendConfirmationEmail(email, token);
		return json({
			ok: true,
			message: "check your inbox to confirm",
		});
	} catch (error) {
		console.error("subscribe error:", error);
		const detail = error instanceof Error ? error.message : String(error);
		return json(
			{ ok: false, message: `something went wrong: ${detail}` },
			500,
		);
	}
};

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}
