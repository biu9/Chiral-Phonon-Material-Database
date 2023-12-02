import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID || '';

export async function GET() {

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: 'authkit',

    // The callback URI AuthKit will redirect to after authentication
    redirectUri: 'http://localhost:3000/api/authCallback',
    clientId,
  });

  // Redirect the user to the AuthKit sign-in page
  return NextResponse.redirect(authorizationUrl);
}