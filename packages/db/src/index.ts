// @ts-ignore - Prisma's v7 custom output is a generated TypeScript client.
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../../packages/db/.env") });
config({ path: resolve(process.cwd(), "packages/db/.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set for @repo/db");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
    prisma:PrismaClient | undefined
}

export const prisma = 
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log:["query","error","warn"]
    })

    
if(process.env.NODE_ENV!=="production"){
    globalForPrisma.prisma = prisma
}
