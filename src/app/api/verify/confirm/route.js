import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const POST = async (req) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, code } = await req.json();

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

    // Check if the verification token is valid and not expired
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
        expires: {
          gt: new Date(), // Token should be valid if the expiration date is in the future
        },
      },
    });

    if (!verificationToken) {
      return new Response(JSON.stringify({ error: 'Invalid or expired verification code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    // Delete the verification token as it has been used
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    return new Response(JSON.stringify({ message: 'Email verified successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error confirming verification code:', error);
    return new Response(JSON.stringify( { error: error}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
};
