import { PrismaPg } from "@prisma/adapter-pg";
import { Scope } from "@/prisma/client/client";
import { prisma } from "@/lib/prisma";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const products = [
    { name: "Laptop", scope: Scope.IT_HARDWARE },
    { name: "Monitor", scope: Scope.IT_HARDWARE },
    { name: "Keyboard", scope: Scope.IT_HARDWARE },
    { name: "Mouse", scope: Scope.IT_HARDWARE },
    { name: "Docking Station", scope: Scope.IT_HARDWARE },
    { name: "Router", scope: Scope.IT_HARDWARE },
    { name: "Printer", scope: Scope.IT_HARDWARE },
    { name: "Server", scope: Scope.IT_HARDWARE },
    { name: "Headset", scope: Scope.IT_HARDWARE },
    { name: "Webcam", scope: Scope.IT_HARDWARE },

    { name: "Paper A4", scope: Scope.OFFICE_SUPPLIES },
    { name: "Stapler", scope: Scope.OFFICE_SUPPLIES },
    { name: "Pens Pack", scope: Scope.OFFICE_SUPPLIES },
    { name: "Notebooks", scope: Scope.OFFICE_SUPPLIES },
    { name: "Post-it Notes", scope: Scope.OFFICE_SUPPLIES },
    { name: "Folders", scope: Scope.OFFICE_SUPPLIES },
    { name: "Ink Cartridges", scope: Scope.OFFICE_SUPPLIES },
    { name: "Tape Dispenser", scope: Scope.OFFICE_SUPPLIES },
    { name: "Highlighters", scope: Scope.OFFICE_SUPPLIES },
    { name: "Desk Organizer", scope: Scope.OFFICE_SUPPLIES },

    { name: "Cement Bag", scope: Scope.CONSTRUCTION },
    { name: "Bricks Pallet", scope: Scope.CONSTRUCTION },
    { name: "Steel Beams", scope: Scope.CONSTRUCTION },
    { name: "Concrete Blocks", scope: Scope.CONSTRUCTION },
    { name: "Gravel", scope: Scope.CONSTRUCTION },
    { name: "Timber Plank", scope: Scope.CONSTRUCTION },
    { name: "Insulation Sheets", scope: Scope.CONSTRUCTION },
    { name: "Roof Tiles", scope: Scope.CONSTRUCTION },
    { name: "PVC Pipes", scope: Scope.CONSTRUCTION },
    { name: "Paint Bucket", scope: Scope.CONSTRUCTION },
  ];

  for (const p of products) {
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
