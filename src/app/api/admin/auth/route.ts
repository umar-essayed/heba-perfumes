import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  DEFAULT_ADMIN_PASSWORD,
  generateAdminToken,
  verifyAdminToken,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts
} from '@/lib/auth/adminAuth';

const COOKIE_NAME = 'heba_admin_token';

// GET: Check authentication status
export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAuthenticated = verifyAdminToken(token);

  return NextResponse.json({
    authenticated: isAuthenticated
  });
}

// POST: Log in with admin password
export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار ${rateLimit.waitSeconds} ثانية.`
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password || password.trim() !== DEFAULT_ADMIN_PASSWORD) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'كلمة المرور غير صحيحة.'
        },
        { status: 401 }
      );
    }

    // Success: clear rate limit attempts and issue signed token
    clearFailedAttempts(ip);
    const token = generateAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح.'
    });

    // Set secure HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول.' },
      { status: 500 }
    );
  }
}

// DELETE: Log out
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح.'
  });

  response.cookies.delete(COOKIE_NAME);
  return response;
}
