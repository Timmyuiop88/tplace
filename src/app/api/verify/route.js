import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';  // Not needed for generating numeric codes
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { TradePlaceVerificationEmail } from '@/components/emailTemplate';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email } = await req.json();

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the code in the database with an expiration date
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires: new Date(Date.now() + 3600000), // Token expires in 1 hour
      },
    });
console.log({code})
    // Send verification email
    await resend.emails.send({
      from: 'TradePlace <onboarding@quantumassetvault.co>',
      to: [email],
      subject: 'Verify Your Email Address',
      react: <TradePlaceVerificationEmail verificationCode={code}/>,
    });

    return new Response(JSON.stringify({ message: 'Verification email sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send verification email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
};
