import { auth as middleware } from '@/auth';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default middleware(async (req) => {
  const isRoleMng = req.nextUrl.pathname.startsWith('/no_role');

  if (!isRoleMng) {
    // 등록되지 않은 유저 확인
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.email) {
      const checkUserRes = await fetch(
        `${req.nextUrl.origin}/api/common/check_user?email=${token.email}`
      );
      const checkUserData = await checkUserRes.json();

      if (!checkUserData.success) {
        return NextResponse.redirect(new URL('/no_role', req.url));
      }
    }
  }

  if (!req.auth && req.nextUrl.pathname !== '/') {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
