import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

type GlobalForPrisma = typeof global & { prisma?: PrismaClient };

const globalForPrisma = global as GlobalForPrisma;

const prisma =
	globalForPrisma.prisma ??
	(process.env.NODE_ENV === 'production'
		? new PrismaClient().$extends(withAccelerate())
		: new PrismaClient().$extends(withAccelerate()));

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;
