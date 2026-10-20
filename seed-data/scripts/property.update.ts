import { prisma } from "../../src/lib/prisma";

const propertyNames: Record<string, string[]> = {
  Apartment: [
    "Urban Nest",
    "Cedar Heights",
    "Lakeview Residence",
    "Golden Horizon",
    "Maple Court",
    "The Grand Living",
    "Silver Oak Residence",
    "Parkside Haven",
    "Emerald Heights",
    "Bluebell Residence",
    "Royal Orchid",
    "The Crescent",
    "Willow Gardens",
  ],

  Condo: [
    "Skyline Haven",
    "Crystal Heights",
    "Pearl Residence",
    "Azure Living",
    "The Summit",
    "Ocean Breeze",
    "Moonlight Residence",
    "Sterling Place",
    "Ivory Heights",
    "Golden Crest",
    "The Pavilion",
    "Diamond Residence",
  ],

  Duplex: [
    "Grand Vista",
    "The Heritage",
    "Royal Meadows",
    "Oakwood Residence",
    "Sunrise Manor",
    "The Retreat",
    "Amber House",
    "Silverstone Residence",
    "Evergreen Manor",
    "The Palms",
    "Crystal Manor",
    "Golden Valley",
    "The Windsor",
    "Rosewood Residence",
    "Kingswood House",
    "The Aristocrat",
  ],

  House: [
    "Maple House",
    "Willow House",
    "Rosewood Haven",
    "Greenfield Residence",
    "Sunset House",
    "The Homestead",
    "Meadow House",
    "Oakridge Residence",
    "Springfield House",
    "The Sanctuary",
    "Pinecrest House",
    "Harmony Residence",
    "The Courtyard",
    "Amber Residence",
    "Evergreen House",
  ],

  Townhouse: [
    "Harmony Townhouse",
    "The Village",
    "Willow Court",
    "Maple Grove",
    "The Courtyard Homes",
    "Rose Garden Residence",
    "Oak Lane Homes",
    "The Terrace",
    "Meadow Court",
    "Parkview Homes",
    "Cedar Grove",
    "The Enclave",
  ],

  Villa: [
    "Serenity Villa",
    "Royal Haven",
    "Palm Grove Villa",
    "The White House",
    "Sunset Villa",
    "Emerald Villa",
    "Rosewood Villa",
    "Golden Villa",
    "The Retreat Villa",
    "Willow Villa",
    "Crystal Villa",
    "Harmony Villa",
  ],
};

async function updatePropertyNames() {
  let updated = 0;

  await prisma.$transaction(
    async (tx) => {
      for (const [categoryName, names] of Object.entries(propertyNames)) {
        const properties = await tx.property.findMany({
          where: {
            category: {
              name: categoryName,
            },
            title: {
              startsWith: `${categoryName} Property `,
            },
          },
          orderBy: {
            title: "asc",
          },
          select: {
            id: true,
            title: true,
          },
        });

        if (properties.length !== names.length) {
          throw new Error(
            `${categoryName}: expected ${names.length}, found ${properties.length}. No changes committed.`,
          );
        }

        for (const [index, property] of properties.entries()) {
          const newTitle = names[index];

          await tx.property.update({
            where: {
              id: property.id,
            },
            data: {
              title: newTitle,
            },
          });

          console.log(`${property.title} -> ${newTitle}`);
          updated++;
        }
      }
    },
    {
      maxWait: 10000,
      timeout: 60000,
    },
  );

  console.log(`\nSuccessfully updated ${updated} property names.`);
}

updatePropertyNames()
  .catch((error: unknown) => {
    console.error("Property name update failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });