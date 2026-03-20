import { prisma } from "@/lib/db";

export async function checkContactCooldown(
  email: string,
  ip: string
): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  const now = new Date();

  const existingByEmail = await prisma.contact.findFirst({
    where: { email, expiresAt: { gt: now } },
    orderBy: { expiresAt: "desc" },
  });
  if (existingByEmail) {
    const remaining = Math.ceil(
      (existingByEmail.expiresAt.getTime() - now.getTime()) / 1000
    );
    return { allowed: false, remainingSeconds: remaining };
  }

  const existingByIp = await prisma.contact.findFirst({
    where: { ip, expiresAt: { gt: now } },
    orderBy: { expiresAt: "desc" },
  });
  if (existingByIp) {
    const remaining = Math.ceil(
      (existingByIp.expiresAt.getTime() - now.getTime()) / 1000
    );
    return { allowed: false, remainingSeconds: remaining };
  }

  return { allowed: true };
}

export async function saveContactSubmission(
  name: string,
  email: string,
  message: string,
  ip: string,
  expiresAt: Date
) {
  const existing = await prisma.contact.findFirst({
    where: { email },
    orderBy: { submittedAt: "desc" },
  });

  if (existing) {
    await prisma.contact.update({
      where: { id: existing.id },
      data: {
        name,
        message,
        ip,
        submittedAt: new Date(),
        expiresAt,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.contact.create({
      data: { name, email, message, ip, expiresAt },
    });
  }
}
