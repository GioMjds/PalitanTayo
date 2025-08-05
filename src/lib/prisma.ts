import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaInstance = new PrismaClient().$extends(withAccelerate());
type PrismaExtendedClient = typeof prismaInstance;
type GlobalForPrisma = typeof global & { prisma?: PrismaExtendedClient };

const globalForPrisma = global as GlobalForPrisma;

const prisma =
	globalForPrisma.prisma ??
	(process.env.NODE_ENV === 'development'
		? new PrismaClient().$extends(withAccelerate())
		: new PrismaClient().$extends(withAccelerate()));

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;
