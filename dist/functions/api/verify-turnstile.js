// Cloudflare Pages Function — lives at /api/verify-turnstile on your deployed site.
// Verifies a Cloudflare Turnstile token server-side, so the check can't be
// spoofed from the browser. Requires a TURNSTILE_SECRET_KEY environment
// variable/secret set in your Cloudflare Pages project settings
// (Settings -> Environment variables -> add TURNSTILE_SECRET_KEY as a secret,
// value = your Turnstile secret key from the Cloudflare dash. NOT the sitekey).

export async function onRequestPost(context) {
    const { request, env } = context;

    let body;
    try {
        body = await request.json();
    } catch (e) {
        return jsonResponse({ success: false, error: "Invalid request body" }, 400);
    }

    const token = body?.token;
    if (!token || typeof token !== "string") {
        return jsonResponse({ success: false, error: "Missing token" }, 400);
    }

    if (!env.TURNSTILE_SECRET_KEY) {
        // Fails closed: if the secret isn't configured, nothing gets verified.
        return jsonResponse({ success: false, error: "Server misconfigured" }, 500);
    }

    const verifyForm = new FormData();
    verifyForm.append("secret", env.TURNSTILE_SECRET_KEY);
    verifyForm.append("response", token);

    // Optionally bind to the caller's IP for extra confidence (not required).
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) verifyForm.append("remoteip", ip);

    try {
        const cfResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            { method: "POST", body: verifyForm }
        );
        const outcome = await cfResponse.json();

        if (outcome.success) {
            return jsonResponse({ success: true });
        }
        return jsonResponse({ success: false, errorCodes: outcome["error-codes"] || [] }, 403);
    } catch (e) {
        return jsonResponse({ success: false, error: "Verification request failed" }, 502);
    }
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}
