import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const POST = async (request) => {
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

  const { offerId } = await request.json();

  if (!offerId) {
    return new Response(JSON.stringify({ error: 'Offer ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Find the offer and include the product details
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { product: true },
    });

    // Check if the offer exists and if the user is the product owner
    if (!offer || offer.product.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized or Offer not found' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Update the offer to set it as rejected
    const rejectedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { accepted: false },
    });

    return new Response(JSON.stringify(rejectedOffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to reject offer', error);
    return new Response(JSON.stringify({ error: 'Failed to reject offer' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
};
