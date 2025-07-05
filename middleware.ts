import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const isAuthReq = req.nextUrl.pathname.startsWith('/api/auth');
  // const isNoRole = req.nextUrl.pathname.startsWith('/no_role');

  // 허용할 공개 API 엔드포인트들
  const publicApiEndpoints = [
    '/api/model/status-ping',
    '/api/common/db-server-ping',
  ];

  const isPublicApi = publicApiEndpoints.some(
    (endpoint) => req.nextUrl.pathname === endpoint
  );

  // auth 관련 요청과 공개 API는 미들웨어 처리하지 않음
  if (isAuthReq || isPublicApi) {
    return NextResponse.next();
  }

  // 로그인 안 된 사용자는 모두 root로 redirect (공개 API 제외)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  if (!token && req.nextUrl.pathname !== '/') {
    const newUrl = new URL('/', req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
