import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.testData.create({
    data: {
      name: "Sample Test Data",
    },
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
