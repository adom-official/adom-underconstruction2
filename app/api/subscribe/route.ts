import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Endpoint nhận email đăng ký waitlist.
 *
 * Hiện tại chỉ log lại email (phù hợp để demo/test). Trước khi lên production,
 * hãy nối endpoint này với một dịch vụ thật, ví dụ:
 * - Google Sheets API / Airtable
 * - Mailchimp / Resend / Brevo (email marketing)
 * - Một bảng "subscribers" trong database (Supabase, Postgres, ...)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    // TODO: thay đoạn dưới bằng tích hợp thật (Mailchimp, Resend, DB, ...)
    console.log(`[waitlist] Email mới đăng ký: ${email}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }
}
