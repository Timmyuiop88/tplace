import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust the path as necessary

const prisma = new PrismaClient();

// POST Route: Handle successful payment and update user points and transaction record
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, points, currency, paymentMethod, transactionId } = await req.json();

    // Validate required fields
    if (!amount || !points || !currency || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch user from the session
    const userId = session.user.id;

    // Update user's points
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } }, // Increment user's points
    });

    // Add the transaction record
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        currency,
        status: 'completed', // Assuming a successful transaction
        paymentMethod,
        transactionId: `${transactionId}` || null,
        userId,
        type: 'purchase_points',
        points,
      },
    });

    return NextResponse.json({ user: updatedUser, transaction }, { status: 200 });
  } catch (error) {
    console.error('Failed to process payment success', error);
    return NextResponse.json({ error: 'Failed to process payment success' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
