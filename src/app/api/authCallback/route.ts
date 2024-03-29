import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { SignJWT } from 'jose';
import { adminEmail } from '@/conf/auth';

const secret = new Uint8Array(
  Buffer.from(process.env.JWT_SECRET_KEY || '', 'base64'),
);

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID as string;

export async function GET(req: NextRequest) {
  // The authorization code returned by AuthKit
  const code = req.nextUrl.searchParams.get('code') as string;

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });
  
  // Cleanup params and redirect to homepage
  const url = process.env.NODE_ENV === 'production' ? 'https://materialsfingerprint.com/' : 'http://localhost:3000/';
  const response = NextResponse.redirect(url);

  const role = user.email === adminEmail ? 'admin' : 'user';

  // Create a JWT with the user's information
  const token = await new SignJWT({
    // Here you might lookup and retrieve user details from your database
    user,
    role
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('2400h')
    .sign(secret);

  // Store in a cookie
  response.cookies.set({
    name: 'token',
    value: token,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return response;
};
