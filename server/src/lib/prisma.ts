import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DB_URI}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export default prisma;
