// Paste this entire file into the Cloudflare Worker editor (replaces all existing code).
// Secrets in Cloudflare: GITHUB_CLIENT_ID (your Client ID) and GITHUB_OAUTH_ID (your Client Secret)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step 1: redirect to GitHub login
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
      });
      return Response.redirect(
        'https://github.com/login/oauth/authorize?' + params,
        302
      );
    }

    // Step 2: exchange the code GitHub sends back for an access token
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_OAUTH_ID,
          code,
        }),
      });

      const data = await tokenRes.json();
      if (data.error) {
        return new Response('OAuth error: ' + data.error_description, { status: 400 });
      }

      const msg = 'authorization:github:success:' +
        JSON.stringify({ token: data.access_token, provider: 'github' });

      const html =
        '<!doctype html><html><body><script>' +
        '(function(){' +
        'var m=' + JSON.stringify(msg) + ';' +
        'function r(e){window.opener.postMessage(m,e.origin);}' +
        'window.addEventListener("message",r,false);' +
        'window.opener.postMessage("authorizing:github","*");' +
        '})();' +
        '<\/script></body></html>';

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Decap OAuth Proxy is running.', { status: 200 });
  },
};
