import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust the path as necessary

const prisma = new PrismaClient();

// GET Route: Fetch products
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isSold: false,
      },
      include: {
        user: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST Route: Create a new product
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  const { title, description, price, mainPhoto, category, photos } = await req.json();

  // Validate required fields
  if (!title || !description || !price || !mainPhoto || !category || !Array.isArray(photos)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price,
        mainPhoto,
        category,
        photos,
        userId: session.user.id, // Assuming session.user.id contains the user ID
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
