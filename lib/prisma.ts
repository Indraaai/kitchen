import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/client";

// Mengambil URL dari environment variable
const connectionString = `${process.env.DATABASE_URL}`;

// Menggunakan PoolConfig langsung untuk menghindari bentrok tipe antar paket @types/pg
const adapter = new PrismaPg({ connectionString });

// 3. Pola Singleton khusus Next.js
// Ini mencegah Next.js membuat koneksi baru setiap kali kita men-save file saat development (hot-reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

// Menyimpan instance prisma ke object global jika tidak di mode production
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;