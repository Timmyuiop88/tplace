import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function usePoints(userId, requiredPoints) {
  // Fetch the user and check their points
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.points < requiredPoints) {
    throw new Error('Insufficient points');
  }

  // Deduct points from the user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { points: { decrement: requiredPoints } }, // Deduct the required points
  });

  return updatedUser;
}
