import { prisma } from "../../src/lib/prisma";

const addresses = [
  "House 12, Road 4, Gulshan-1",
  "House 18, Road 7, Gulshan-2",
  "House 9, Road 11, Banani",
  "House 22, Road 5, Baridhara",
  "House 15, Road 3, Niketan",
  "House 8, Road 12, Mohakhali",
  "House 24, Road 7, Dhanmondi",
  "House 16, Road 12/A, Dhanmondi",
  "House 11, Road 3, Kalabagan",
  "House 7, Road 2, Jigatola",
  "House 14, Road 6, Lalmatia",
  "House 20, Road 8, Mohammadpur",
  "House 6, Road 4, Hazaribagh",
  "House 17, Road 9, Uttara Sector 4",
  "House 10, Road 6, Uttara Sector 7",
  "House 25, Road 11, Uttara Sector 10",
  "House 13, Road 3, Uttara Sector 11",
  "House 19, Road 5, Uttara Sector 13",
  "House 8, Road 7, Uttara Sector 14",
  "House 21, Road 4, Nikunja-2",
  "House 12, Road 2, Khilkhet",
  "House 16, Road 5, Bashundhara R/A",
  "House 9, Road 8, Bashundhara R/A",
  "House 23, Road 3, Mirpur-1",
  "House 14, Road 6, Mirpur-2",
  "House 7, Road 10, Mirpur-10",
  "House 18, Road 4, Mirpur-11",
  "House 11, Road 7, Pallabi",
  "House 20, Road 3, Kafrul",
  "House 15, Road 6, Kazipara",
  "House 5, Road 9, Shewrapara",
  "House 13, Road 2, Agargaon",
  "House 24, Road 5, Sher-e-Bangla Nagar",
  "House 10, Road 4, Tejgaon",
  "House 17, Road 6, Farmgate",
  "House 8, Road 3, Panthapath",
  "House 19, Road 7, Eskaton",
  "House 12, Road 2, Baily Road",
  "House 21, Road 5, Shantinagar",
  "House 6, Road 4, Malibagh",
  "House 14, Road 8, Mouchak",
  "House 9, Road 3, Rampura",
  "House 18, Road 6, Banasree",
  "House 11, Road 5, Aftabnagar",
  "House 23, Road 2, Khilgaon",
  "House 7, Road 9, Bashabo",
  "House 16, Road 4, Merul Badda",
  "House 20, Road 7, Badda",
  "House 13, Road 3, Uttar Badda",
  "House 5, Road 6, South Badda",
  "House 22, Road 4, Wari",
  "House 10, Road 8, Sutrapur",
  "House 17, Road 2, Lalbagh",
  "House 8, Road 5, Chawkbazar",
  "House 19, Road 3, Gandaria",
  "House 12, Road 6, Jatrabari",
  "House 24, Road 2, Shyamoli",
  "House 6, Road 7, Adabor",
  "House 15, Road 4, Kallyanpur",
  "House 9, Road 5, Darus Salam",
  "House 21, Road 3, Tolarbagh",
  "House 14, Road 6, Senpara Parbata",
  "House 7, Road 2, Baridhara DOHS",
  "House 18, Road 9, Banani DOHS",
  "House 11, Road 4, Bashundhara R/A",
  "House 20, Road 6, Uttara Sector 3",
  "House 13, Road 8, Uttara Sector 9",
  "House 5, Road 3, Dhanmondi",
  "House 16, Road 7, Mohammadpur",
  "House 23, Road 5, Gulshan-1",
  "House 8, Road 11, Banani",
  "House 19, Road 4, Mirpur-10",
  "House 12, Road 6, Banasree",
  "House 21, Road 3, Rampura",
  "House 10, Road 8, Bashundhara R/A",
  "House 17, Road 5, Uttara Sector 12",
  "House 6, Road 2, Niketan",
  "House 14, Road 9, Dhanmondi",
  "House 22, Road 4, Pallabi",
  "House 9, Road 7, Tejgaon",
];

async function updatePropertyAddresses() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        title: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (properties.length !== addresses.length) {
      throw new Error(
        `Expected ${addresses.length} properties, found ${properties.length}. No changes made.`,
      );
    }

    await prisma.$transaction(
      async (tx) => {
        for (const [index, property] of properties.entries()) {
          await tx.property.update({
            where: {
              id: property.id,
            },
            data: {
              address: addresses[index],
            },
          });

          console.log(
            `${property.title} -> ${addresses[index]}`,
          );
        }
      },
      {
        maxWait: 10000,
        timeout: 60000,
      },
    );

    console.log(
      `Successfully updated addresses for ${properties.length} properties.`,
    );
  } catch (error) {
    console.error("Address update failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

updatePropertyAddresses();