import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Code not found', { status: 400 });
  }

  return new Response(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; color: #1e293b;">
        <div style="text-align: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h1 style="color: #002A3A; margin-bottom: 1rem;">Garmin Conectado!</h1>
          <p>Seu Garmin Connect foi sincronizado com sucesso.</p>
          <p style="font-size: 0.875rem; color: #64748b;">Esta janela será fechada automaticamente...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GARMIN_SUCCESS' }, '*');
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
