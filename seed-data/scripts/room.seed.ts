import path from "path";
import fs from "fs";

import { prisma } from "../../src/lib/prisma";
import { cloudinary } from "../../src/lib/cloudinary";
import { RoomType } from "../../src/generated/prisma/enums";



console.log("Room seed started...");

const imageBasePath = path.join(
  process.cwd(),
  "seed-data",
  "room-images",
);

const categories = [
  "apartment",
  "house",
  "condo",
  "duplex",
  "townhouse",
  "villa",
] as const;

const roomTypes = [RoomType.SINGLE, RoomType.DOUBLE];

const uploadToCloudinary = async (filePath: string) => {
  return new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: "nestora/rooms",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );
  });
};

const getRoomRent = (
  category: string,
  roomType: RoomType,
): number => {
  const rentMap: Record<string, Record<RoomType, number>> = {
  apartment: {
    SINGLE: 12000,
    DOUBLE: 18000,
    MASTER: 22000,
    SHARED: 9000,
  },

  house: {
    SINGLE: 14000,
    DOUBLE: 22000,
    MASTER: 28000,
    SHARED: 10000,
  },

  condo: {
    SINGLE: 16000,
    DOUBLE: 24000,
    MASTER: 30000,
    SHARED: 12000,
  },

  duplex: {
    SINGLE: 18000,
    DOUBLE: 28000,
    MASTER: 35000,
    SHARED: 14000,
  },

  townhouse: {
    SINGLE: 15000,
    DOUBLE: 23000,
    MASTER: 30000,
    SHARED: 11000,
  },

  villa: {
    SINGLE: 20000,
    DOUBLE: 30000,
    MASTER: 40000,
    SHARED: 15000,
  },
};

  return rentMap[category][roomType];
};

const seedRooms = async () => {
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalImagesCreated = 0;

  // Get all existing properties
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(`Found ${properties.length} properties`);

  for (const property of properties) {
    const category = await prisma.propertyCategory.findUnique({
      where: {
        id: property.categoryId,
      },
    });

    if (!category) {
      console.log(
        `Skipping property ${property.title}: category not found`,
      );
      continue;
    }

    const categorySlug = category.slug.toLowerCase();

    if (!categories.includes(categorySlug as (typeof categories)[number])) {
      console.log(
        `Skipping property ${property.title}: unsupported category`,
      );
      continue;
    }

    const categoryPath = path.join(
      imageBasePath,
      categorySlug,
    );

    if (!fs.existsSync(categoryPath)) {
      console.log(
        `Image folder not found: ${categoryPath}`,
      );
      continue;
    }

    const images = fs
      .readdirSync(categoryPath)
      .filter((file) =>
        /\.(jpg|jpeg|png|webp)$/i.test(file),
      );

    if (images.length < 2) {
      console.log(
        `Not enough images for ${categorySlug}`,
      );
      continue;
    }

    /*
     * Each property gets 2 rooms:
     *
     * 101 -> SINGLE
     * 102 -> DOUBLE
     */

    for (let roomIndex = 0; roomIndex < 2; roomIndex++) {
      const roomNumber = `${101 + roomIndex}`;
      const roomType = roomTypes[roomIndex];

      // Check existing room
      const existingRoom = await prisma.room.findUnique({
        where: {
          propertyId_roomNumber: {
            propertyId: property.id,
            roomNumber,
          },
        },
        include: {
          images: true,
        },
      });

      if (existingRoom) {
        console.log(
          `Skipping existing room: ${property.title} - Room ${roomNumber}`,
        );

        totalSkipped++;
        continue;
      }

      const baseRent = getRoomRent(
        categorySlug,
        roomType,
      );

      console.log(
        `\nCreating room: ${property.title} - Room ${roomNumber}`,
      );

      // Create room first
      const room = await prisma.room.create({
        data: {
          propertyId: property.id,
          roomNumber,
          roomType,
          baseRent,
        },
      });

      totalCreated++;

      /*
       * Select 2 images.
       *
       * We reuse the available images.
       * No need to keep 320 separate files.
       */

      const imageIndex1 =
        (property.id.length + roomIndex) %
        images.length;

      const imageIndex2 =
        (imageIndex1 + 1) %
        images.length;

      const selectedImages = [
        images[imageIndex1],
        images[imageIndex2],
      ];

      for (const image of selectedImages) {
        const imagePath = path.join(
          categoryPath,
          image,
        );

        console.log(
          `Uploading room image: ${image}`,
        );

        const cloudinaryResult =
          await uploadToCloudinary(imagePath);

        await prisma.roomImage.create({
          data: {
            roomId: room.id,
            imageUrl: cloudinaryResult.secure_url,
            publicId: cloudinaryResult.public_id,
          },
        });

        totalImagesCreated++;
      }

      console.log(
        `Created room: ${room.roomNumber} (${room.roomType})`,
      );
    }
  }

  console.log("\n=================================");
  console.log(`Total rooms created: ${totalCreated}`);
  console.log(`Total rooms skipped: ${totalSkipped}`);
  console.log(
    `Total room images created: ${totalImagesCreated}`,
  );
  console.log("Room seed completed successfully!");
  console.log("=================================");
};

seedRooms()
  .catch((error) => {
    console.error("\nRoom seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });