import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log("✅DB connected com sucesso!");
  } catch (error) {
    console.error("❌DB connection error", error);
  }
};

export default prisma;
