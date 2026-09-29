import path from "path";
import fs from "fs";

import { prisma } from "../src/lib/prisma";
import {cloudinary} from "../src/lib/cloudinary";

console.log("Property seed started...");

const imageBasePath = path.join(
  process.cwd(),
  "seed-data",
  "property-images",
);

const ownerId = "d3c6c458-67bf-4b9a-b447-3a7a3fae5e76";

const categoryIds = {
  apartment: "0ad8218e-5afa-4593-8734-434138853274",
  house: "81172196-c70a-4755-937f-fdfe3be58370",
  condo: "b8e01a51-8bd9-4913-8600-9ced1dff0cef",
  villa: "47124ae5-8d1e-4ef2-8250-3ad4f4dc97f0",
  townhouse: "38961f60-8133-4a03-8559-eb7aaebbc306",
  duplex: "c8d4e0b1-52bc-45ac-ad1f-5ad2a5a44c04",
};

const categories = [
  "apartment",
  "house",
  "condo",
  "duplex",
  "townhouse",
  "villa",
] as const;

const uploadToCloudinary = async (filePath: string) => {
  return new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: "nestora/properties",
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

const seedProperties = async () => {
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const category of categories) {
    const categoryPath = path.join(imageBasePath, category);

    const images = fs
      .readdirSync(categoryPath)
      .filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    console.log(`\n${category}: ${images.length} images`);

    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      const imagePath = path.join(categoryPath, image);

      const propertyNumber = index + 1;

      const title = `${category.charAt(0).toUpperCase()}${category.slice(
        1,
      )} Property ${propertyNumber}`;

      // Check if property already exists
      const existingProperty = await prisma.property.findFirst({
        where: {
          title,
          categoryId: categoryIds[category],
        },
      });

      // Skip existing property
      if (existingProperty) {
        console.log(`Skipping existing property: ${title}`);
        totalSkipped++;
        continue;
      }

      console.log(
        `Uploading ${category} ${index + 1}/${images.length}: ${image}`,
      );

      // Upload image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(imagePath);

      // Create property
      const result = await prisma.property.create({
        data: {
          ownerId,
          categoryId: categoryIds[category],

          title,

          description: `A comfortable ${category} property located in a convenient area with modern living facilities.`,

          address: `Road ${propertyNumber}, ${category} Residential Area`,

          city: "Dhaka",

          propertyImg: cloudinaryResult.secure_url,

          propertyImgPublicId: cloudinaryResult.public_id,
        },
      });

      totalCreated++;

      console.log(`Created property: ${result.title}`);
    }
  }

  console.log("\n=================================");
  console.log(`Total properties created: ${totalCreated}`);
  console.log(`Total properties skipped: ${totalSkipped}`);
  console.log("Property seed completed successfully!");
  console.log("=================================");
};

seedProperties()
  .catch((error) => {
    console.error("\nProperty seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });