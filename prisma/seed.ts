import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const categories = [
        "Eco Home",
        "Skincare",
        "Green Gadgets",
        "Recycled Items",
        "Organic Food",
        "Sustainable Fashion",
    ]

    console.log("Seeding categories...")

    // Use a loop to create categories cleanly
    for (const name of categories) {
        try {
            await prisma.category.upsert({
                where: { name },
                update: {},
                create: { name },
            })
            console.log(`- ${name}`)
        } catch (error) {
            console.warn(`Skipping ${name}:`, error)
        }
    }

    console.log("Seeding completed.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
