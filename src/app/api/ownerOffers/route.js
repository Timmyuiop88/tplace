import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const GET = async (request) => {
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, return a 401 Unauthorized response
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Fetch offers where the product belongs to the logged-in user
    const offers = await prisma.offer.findMany({
      where: {
        product: {
          userId: session.user.id,  // Matches the user ID of the product owner
        },
      },
      include: {
        product: true,  // Include the related product details if needed
        user: true,     // Include the offer maker's user details
      },
    });

    // If no offers are found, return a message
    if (!offers || offers.length === 0) {
      return new Response(JSON.stringify({ message: 'No offers found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Return the offers data as a JSON response
    return new Response(JSON.stringify(offers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch offers', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch offers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
};
