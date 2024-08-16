// src/app/api/offers/route.js

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust path as necessary

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { amount, message, productId } = await req.json();

    // Get the session from the request
    const session = await getServerSession(authOptions);

    // If there's no session, return a 401 (Unauthorized) response
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Create the offer in the database
    const offer = await prisma.offer.create({
      data: {
        amount,
        message,
        productId,
        userId: session.user.id, // assuming user id is available in session
      },
    });

    return new Response(JSON.stringify(offer), { status: 201 });
  } catch (error) {
    console.error('Failed to create offer', error);
    return new Response(JSON.stringify({ error: 'Failed to create offer' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req, res) {
    // Get the session from the request
    const session = await getServerSession(authOptions);
  
    // If there's no session, return a 401 (Unauthorized) response
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  
    const userId = session.user.id;
  
    // If there's a session, proceed to fetch the offers for the logged-in user
    try {
      const offers = await prisma.offer.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
          product: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
      return new Response(JSON.stringify(offers), { status: 200 });
    } catch (error) {
      console.error('Failed to fetch offers', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch offers' }), { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
