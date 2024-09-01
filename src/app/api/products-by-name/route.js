import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const GET = async (request) => {
  const session = await getServerSession(authOptions);

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
  const searchTerm = searchParams.get('name');

  // If no name is provided, return a 400 (Bad Request) response
  if (!searchTerm) {
    return new Response(JSON.stringify({ error: 'Product Name is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Search products by title or description containing the search term
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });

    // If no products are found, return a 404 (Not Found) response
    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ message: 'No products found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch products', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
};
