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
      <p>인증번호는</p>
      <p>${message}</p>
      <p>입니다.</p>
    `,
  });

  return NextResponse.json({ message: "Email sent!" }, { status: 200 });
}
