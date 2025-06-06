import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  pages: {
    signIn: '/login',
    error: '/err',
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth;
      const isApiRoute = request.nextUrl.pathname.startsWith('/api');
      const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');

      if (isApiRoute && !isAuthRoute) {
        // 세션이 있는 경우 세션 기반 인증 허용
        if (isLoggedIn) return true;

        // 세션이 없는 경우 Bearer 토큰 검증
        const token = await getToken({ req: request, secret });

        if (!token) {
          return NextResponse.json(
            { error: '인증이 필요합니다.' },
            { status: 401 }
          );
        }

        // Authorization 헤더가 있는 경우에만 Bearer 토큰 검증
        const authHeader = request.headers.get('authorization');
        if (authHeader && !authHeader.startsWith('Bearer ')) {
          return NextResponse.json(
            { error: 'Bearer 토큰이 필요합니다.' },
            { status: 401 }
          );
        }

        return true;
      }

      if (!isLoggedIn) return false;

      return true;
    },
  },
});
