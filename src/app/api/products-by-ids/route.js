import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const GET = async (request) => {
  const session = await getServerSession(authOptions);

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
      where: { id },
      include: { user: true },
    });

    if (!product) {
      return new Response(null);
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch product', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
};

// PATCH request to update the product
export const PATCH = async (request) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { id, title, description, price } = await request.json();

    if (!id || !title || !description || !price) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price), // assuming price is a float
 
      },
    });

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update product', error);
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
};
