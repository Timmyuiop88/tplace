import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const GET = async (request) => {
  const session = await getServerSession( authOptions);

  // If there's no session, return a 401 (Unauthorized) response
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));

  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!product) {
      return new Response(null);
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch product', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
};