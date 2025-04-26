// app\api\mail\route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Plug 인증번호 입니다.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f2f2f2; padding: 60px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 14px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); padding: 50px 40px; text-align: center;">
        
        <!-- 브랜드 로고/이름 -->
        <div style="font-size: 20px; font-weight: 600; color: #4F46E5; margin-bottom: 40px;">Plug</div>
        
        <!-- 메인 안내 -->
        <h1 style="font-size: 24px; color: #1d1d1f; margin-bottom: 24px; font-weight: 700;">인증번호 안내</h1>
        <p style="font-size: 17px; color: #1d1d1f; margin-bottom: 32px; line-height: 1.5;">요청하신 인증번호를 아래에 안내드립니다.</p>
        
        <!-- 인증번호 -->
        <div style="display: inline-block; background-color: #f2f2f7; border-radius: 12px; padding: 20px 30px; font-size: 36px; font-weight: 700; color: #4F46E5; letter-spacing: 3px; margin-bottom: 40px;">
          ${message}
        </div>
        
        <!-- 하단 안내 문구 -->
        <p style="font-size: 13px; color: #6e6e73; line-height: 1.5;">본인이 요청하지 않은 경우, 이 메일을 무시해 주세요.<br>보안을 위해 인증번호는 타인과 공유하지 마세요.</p>
      </div>

      <!-- 푸터 -->
      <div style="max-width: 480px; margin: 30px auto 0; text-align: center; font-size: 12px; color: #a1a1aa;">
        © Plug. 2025 All rights reserved.
      </div>
    </div>
    `,
  });

  return NextResponse.json({ message: "Email sent!" }, { status: 200 });
}
