import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      authId: "test-uid-123",
      email: "test@example.com",
    },
  });
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
