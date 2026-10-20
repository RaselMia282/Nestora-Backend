import { Prisma } from "../../src/generated/prisma/client";
import { prisma } from "../../src/lib/prisma";


// ───────────────────────────────────────────────────────────
// Category অনুযায়ী ভাড়া (টাকা/মাস)
// ───────────────────────────────────────────────────────────
const RENT_RANGES: Record<string, { min: number; max: number }> = {
  Apartment: { min: 8_000, max: 25_000 },
  Condo: { min: 10_000, max: 35_000 },
  Duplex: { min: 20_000, max: 60_000 },
  House: { min: 25_000, max: 80_000 },
  Townhouse: { min: 18_000, max: 50_000 },
  Villa: { min: 50_000, max: 2_00_000 },
};

// ───────────────────────────────────────────────────────────
// Category অনুযায়ী area (sqft)
// ───────────────────────────────────────────────────────────
const AREA_RANGES: Record<string, { min: number; max: number }> = {
  Apartment: { min: 500, max: 1_500 },
  Condo: { min: 600, max: 1_800 },
  Duplex: { min: 1_200, max: 2_500 },
  House: { min: 1_000, max: 3_000 },
  Townhouse: { min: 900, max: 2_000 },
  Villa: { min: 2_000, max: 6_000 },
};

const FALLBACK_RENT = { min: 10_000, max: 50_000 };
const FALLBACK_AREA = { min: 500, max: 2_000 };
const RENT_ROUND_TO = 500;
const AREA_ROUND_TO = 50;

function randInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRentFor(categoryName: string): Prisma.Decimal {
  const { min, max } = RENT_RANGES[categoryName] ?? FALLBACK_RENT;
  const raw = randInRange(min, max);
  const rounded = Math.floor(raw / RENT_ROUND_TO) * RENT_ROUND_TO;
  return new Prisma.Decimal(rounded);
}

function randomAreaFor(categoryName: string): number {
  const { min, max } = AREA_RANGES[categoryName] ?? FALLBACK_AREA;
  const raw = randInRange(min, max);
  return Math.floor(raw / AREA_ROUND_TO) * AREA_ROUND_TO;
}

async function run() {
  const properties = await prisma.property.findMany({
    where: { OR: [{ fullRent: null }, { areaSqft: null }] },
    select: {
      id: true,
      title: true,
      fullRent: true,
      areaSqft: true,
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (properties.length === 0) {
    console.log("✅ সব property-তে fullRent ও areaSqft আগেই সেট করা আছে।");
    return;
  }

  console.log(`📦 ${properties.length} টা property আপডেট হবে...\n`);

  let updated = 0;

  await prisma.$transaction(
    async (tx) => {
      for (const p of properties) {
        const cat = p.category.name;
        const newRent = p.fullRent ?? randomRentFor(cat);
        const newArea = p.areaSqft ?? randomAreaFor(cat);

        await tx.property.update({
          where: { id: p.id },
          data: { fullRent: newRent, areaSqft: newArea },
        });

        console.log(
          `[${cat.padEnd(10)}] ${p.title.padEnd(35)} | rent: ${String(
            newRent.toString(),
          ).padStart(9)} | area: ${String(newArea).padStart(5)} sqft`,
        );
        updated++;
      }
    },
    { maxWait: 10_000, timeout: 60_000 },
  );

  console.log(`\n✅ ${updated} টা property আপডেট হয়েছে।`);
}

run()
  .catch((e) => {
    console.error("❌ failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
