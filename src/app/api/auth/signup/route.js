import TradePlaceWelcomeEmail from '@/components/emailTemplate';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';


const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { firstName, lastName, phoneNumber, email, password } = await req.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email is already in use' }),
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        email,
        password: hashedPassword,
      },
    });

    // Send registration email
    await resend.emails.send({
      from: 'TradePlace <onboarding@quantumassetvault.co>',
      to: [email],
      subject: 'Welcome to TradePlace!',
      react: TradePlaceWelcomeEmail(), // Pass user info to the email template
    });

    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup route:', error);

    // Check for specific Prisma error codes
    if (error.code === 'P2002' || error?.meta?.target?.includes('email')) {
      return new Response(
        JSON.stringify({ error: 'Email is already in use' }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to sign up' }),
      { status: 500 }
    );
  }
}
