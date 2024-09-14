import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(req) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  
    const userId = session.user.id;
    const data = await req.json();
  
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      });
  
      return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
      console.error('Error updating user details:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }

export async function GET(req) {
    const session = await getServerSession( authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        lastName: true,
        firstName: true,
emailVerified:true,
        points: true,
        offers: {
          select: { id: true },
        },
        products: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const userData = {
      ...user,
      offersCount: user.offers.length,
      productsCount: user.products.length,
    };

    delete userData.offers;
    delete userData.products;

    return new Response(JSON.stringify(userData), { status: 200 });
} catch (error) {
    console.error('Error fetching user details:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}