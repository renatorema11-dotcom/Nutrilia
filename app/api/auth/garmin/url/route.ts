import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/garmin/callback`;

  // Note: Garmin uses OAuth 1.0a or 2.0 depending on the API. 
  // This is a placeholder for the URL construction.
  const params = new URLSearchParams({
    client_id: process.env.GARMIN_CLIENT_ID || 'dummy-garmin-id',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'activity',
  });

  const authUrl = `https://connect.garmin.com/oauth/authorize?${params}`;

  return NextResponse.json({ url: authUrl });
}
