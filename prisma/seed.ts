import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
async function main() {
  await prisma.categories.create({
    data: {
      id: crypto.randomUUID(),
      name: "Pizzas Doces",
    },
  });

  await prisma.categories.create({
    data: {
      id: crypto.randomUUID(),
      name: "Pizzas Salgadas",
    },
  });

  await prisma.categories.create({
    data: {
      id: crypto.randomUUID(),
      name: "Pizzas Vegetarianas",
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
