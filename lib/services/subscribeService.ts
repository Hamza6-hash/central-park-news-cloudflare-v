import { prisma } from "@/lib/db";

export async function getSubscribeUserByEmail(email: string) {
  return prisma.subscribeUser.findUnique({
    where: { email },
  });
}

export async function createSubscribeUser(data: {
  email: string;
  unsubscribeToken: string;
  status?: string;
  tokenCreatedAt?: Date;
  tokenExpiresAt?: Date;
}) {
  return prisma.subscribeUser.create({
    data: {
      email: data.email,
      unsubscribeToken: data.unsubscribeToken,
      status: data.status ?? "active",
      tokenCreatedAt: data.tokenCreatedAt ?? new Date(),
      tokenExpiresAt: data.tokenExpiresAt,
    },
  });
}

export async function markSubscribeUserTokenUsed(email: string) {
  return prisma.subscribeUser.update({
    where: { email },
    data: { tokenUsed: true, tokenUsedAt: new Date() },
  });
}

export async function deleteSubscribeUser(email: string) {
  return prisma.subscribeUser.delete({
    where: { email },
  });
}
