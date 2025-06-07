import { auth as middleware } from '@/auth';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default middleware(async (req) => {
  const isRoleMng = req.nextUrl.pathname.startsWith('/no_role');
  const isApiReq = req.nextUrl.pathname.startsWith('/api');
  if (!isRoleMng && !isApiReq) {
    //  미등록 유저는 /no_role로 redirect
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token?.email) {
      console.log('hello', req.nextUrl.pathname);
      const checkUserRes = await fetch(
        `${req.nextUrl.origin}/api/common/check_user?email=${token.email}`,
        {
          headers: {
            Authorization: `Bearer ${token.jwt}`,
          },
        }
      );

      if (!checkUserRes.ok) {
        console.error(
          'API 응답 에러:',
          checkUserRes.status,
          checkUserRes.statusText
        );
        const newUrl = new URL('/no_role', req.url);
        return NextResponse.redirect(newUrl);
      }
    }
  }
  // 로그인 안 된 사용자는 모두 root로 redirect
  if (!req.auth && req.nextUrl.pathname !== '/') {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
