import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Code not found', { status: 400 });
  }

  // In a real app:
  // const tokens = await exchangeCodeForTokens(code);
  // await saveTokensToDatabase(tokens, userId);

  // Return the success script to close the popup and notify the parent
  return new Response(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #1e293b;">
        <div style="text-align: center; background: white; padding: 2rem; rounded-xl: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h1 style="color: #059669; margin-bottom: 1rem;">Conexão Bem-sucedida!</h1>
          <p>Seu Google Fit foi conectado ao Nutrilia.</p>
          <p style="font-size: 0.875rem; color: #64748b;">Esta janela será fechada automaticamente...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_FIT_SUCCESS' }, '*');
              setTimeout(() => window.close(), 1500);
            } else {
              window.location.href = '/dashboard/dispositivos';
            }
          </script>
        </div>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}
