import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const GET = async (request) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,  // Include product details if available
      },
      orderBy: {
        createdAt: 'desc',  // Order by the most recent transaction first
      },
    });

    return new Response(JSON.stringify(transactions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch transactions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
};
