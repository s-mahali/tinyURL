import {PrismaClient} from "../prisma/generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import "dotenv/config";

const connectionString = `${process.env.DB_URI}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter})
export default prisma;
