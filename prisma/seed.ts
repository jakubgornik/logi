import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/shared/consts";

async function main() {
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: p,
      });
    }
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
