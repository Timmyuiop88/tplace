import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { CallbackRequestEmail } from '@/components/callbackEmail';  // Adjust to your actual email template

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the request body to get the product ID
    const { productId } = await req.json();
const userMessage = 'I am ready to Negotiate on this Product'
    if (!productId) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch product details to find the owner's email
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: true, // Assuming 'user' is the relation to the product owner
      },
    });

    if (!product || !product.user) {
      return new Response(JSON.stringify({ error: 'Product or owner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get product owner's email
    const ownerEmail = product.user.email;

    if (!ownerEmail) {
      return new Response(JSON.stringify({ error: 'Product owner email not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email notification to product owner
    await resend.emails.send({
      from: 'TradePlace <onboarding@tradeplace.ng>',
      to: [ownerEmail],  // 'to' must be an array
      subject: 'Someone is Interested in Your Product!',
      react: <CallbackRequestEmail message={userMessage} productName={product.name} />,
    });

    return new Response(JSON.stringify({ message: 'Callback request sent to product owner' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending callback request email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send callback request email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
};
