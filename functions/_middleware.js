export async function onRequest(context) {
  // 1. Fetch the original HTML response
  const response = await context.next();
  
  // 2. Only process HTML pages
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // 3. Generate a random nonce (16 bytes, Base64 encoded)
  const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = btoa(String.fromCharCode(...nonceBytes));

  // 4. Construct CSP header (strict mode)
  const csp = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ");

  // 5. Create a mutable response and set the CSP header
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Content-Security-Policy", csp);
  newResponse.headers.set("Cache-Control", "private, no-store");

  // 6. Use HTMLRewriter to inject the nonce into all <script> tags
return new HTMLRewriter()
  .on("script", {
    element(el) {
      // Add the nonce to EVERY script tag (inline and external)
      el.setAttribute("nonce", nonce);
    }
  })
  .transform(newResponse);
}