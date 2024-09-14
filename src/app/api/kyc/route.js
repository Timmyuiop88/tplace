import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { useEdgeStore } from '@/app/edgeProvider';

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

  try {
    // Extract the form data from the request
    const formData = await request.json();
    const { idFrontUrl, idBackUrl } = formData;

    if (!idFrontUrl || !idBackUrl) {
      return new Response(JSON.stringify({ error: 'Both ID front and back images are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Create a new KYC record in the database
    const kyc = await prisma.KYCApplication.create({
      data: {
        userId: session.user.id,
        idFront: idFrontUrl,
        idBack: idBackUrl,
      },
    });

    // Return the created KYC record
    return new Response(JSON.stringify(kyc), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to submit KYC', error);
    return new Response(JSON.stringify({ error: 'Failed to submit KYC' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
};
