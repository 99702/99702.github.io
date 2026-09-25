const ASCII_CARD = `
\x1b[36m+---------------------------------------------------+\x1b[0m
\x1b[36m|\x1b[0m                                                   \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m    \x1b[1;33mRajan Paudel\x1b[0m                                   \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m    \x1b[37mSoftware Engineer\x1b[0m                              \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m                                                   \x1b[36m|\x1b[0m
\x1b[36m+---------------------------------------------------+\x1b[0m
\x1b[36m|\x1b[0m                                                   \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m    \x1b[90mweb\x1b[0m        rajanpaudel.dev                     \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m    \x1b[90mgithub\x1b[0m    github.com/99702                     \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m    \x1b[90mlinkedin\x1b[0m  linkedin.com/in/rajan99702           \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m    \x1b[90mmail\x1b[0m      rajan99702@proton.me                 \x1b[36m|\x1b[0m
\x1b[36m|\x1b[0m                                                   \x1b[36m|\x1b[0m
\x1b[36m+---------------------------------------------------+\x1b[0m
`;

const ASCII_CARD_PLAIN = `
+---------------------------------------------------+
|                                                   |
|    Rajan Paudel                                   |
|    Software Engineer                              |
|                                                   |
+---------------------------------------------------+
|                                                   |
|    web        rajanpaudel.dev                     |
|    github     github.com/99702                    |
|    linkedin   linkedin.com/in/rajan99702          |
|    mail       rajan99702@proton.me                |
|                                                   |
+---------------------------------------------------+
`;

const HEADERS = {
  "X-Made-By": "Rajan Paudel",
  "X-Linkedin": "https://linkedin.com/in/rajan99702",
  "X-Site": "https://rajanpaudel.dev",
  "X-GitHub": "https://github.com/99702",
};

function isTerminalClient(ua) {
  if (!ua) return false;
  const l = ua.toLowerCase();
  return (
    l.startsWith("curl/") ||
    l.startsWith("wget/") ||
    l.startsWith("httpie/") ||
    l.startsWith("python-requests/") ||
    l.startsWith("python-httpx/") ||
    l.startsWith("go-http-client/") ||
    l.startsWith("powershell/") ||
    l.includes("libcurl") ||
    l.includes("aria2")
  );
}

export async function onRequest(context) {
  const ua = context.request.headers.get("User-Agent") || "";

  if (isTerminalClient(ua)) {
    const card = ua.toLowerCase().startsWith("curl/") ? ASCII_CARD : ASCII_CARD_PLAIN;
    return new Response(card, {
      headers: { "Content-Type": "text/plain; charset=utf-8", ...HEADERS },
    });
  }

  const response = await context.next();
  const newResponse = new Response(response.body, response);
  for (const [k, v] of Object.entries(HEADERS)) {
    newResponse.headers.set(k, v);
  }
  return newResponse;
}
