import { Query } from "pg";
import { prisma } from "../../lib/prisma";
import {
  ICreateProperty,
  IGetAllPropertiesQuery,
  IUpdateProperty,
} from "./property.interface";

import { Prisma,} from "../../generated/prisma/client";
import { cloudinary } from "../../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

const createPropertyIntoDb = async (
  payload: ICreateProperty,
  ownerId: string,
) => {
  const { categoryId, title, description, address, city } = payload;

  const result = await prisma.property.create({
    data: {
      ownerId,
      categoryId,
      title,
      description,
      address,
      city,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const getAllPropertiesIntoDb = async (payload: IGetAllPropertiesQuery) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    city,
    sort = "latest",
  } = payload;

  // pagination
  const skip = (page - 1) * limit;

  // where condition
  const where: Prisma.PropertyWhereInput = {};

  // search
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        address: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // category filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // city filter
  if (city) {
    where.city = {
      equals: city,
      mode: "insensitive",
    };
  }

  const properties = await prisma.property.findMany({
    where,
    skip,
    take: limit,

    orderBy: {
      createdAt: sort === "latest" ? "desc" : "asc",
    },

    include: {
      category: true,
    },
  });

  const total = await prisma.property.count({
    where,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

const getSinglePropertyIntoDb = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
  if (!result) {
    throw new Error("Property does not exist");
  }
  return result;
};

const updatePropertyIntoDB = async (id, payload: IUpdateProperty, ownerId) => {
  const isPropertyExists = await prisma.property.findUnique({
    where: { id },
  });

  if (!isPropertyExists) {
    throw new Error("Property does not exists");
  }

  if (isPropertyExists.ownerId !== ownerId) {
    throw new Error("You are not authorized");
  }

  const result = await prisma.property.update({
    where: { id },
    data: {
      ...payload,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const deletePropertyIntoDB = async (id: string, ownerId: string) => {
  const isPropertyExists = await prisma.property.findUnique({
    where: { id },
  });
  if (!isPropertyExists) {
    throw new Error("Property does not exist");
  }

  if (isPropertyExists.ownerId !== ownerId) {
    throw new Error("You are not authorized to delete this property!");
  }

  const result = await prisma.property.delete({
    where: { id },
  });

  return result;
};

const uploadPropertyImgIntoDB = async (id:string, ownerId:string, buffer: Buffer) => {
  const isPropertyExists = await prisma.property.findUnique({
    where: { id },
  });
  if (!isPropertyExists) {
    throw new Error("Property does not exist");
  }

  if (isPropertyExists.ownerId !== ownerId) {
    throw new Error("You are not authorized to upload Image");
  }

  if (isPropertyExists.propertyImgPublicId) {
    await cloudinary.uploader.destroy(isPropertyExists.propertyImgPublicId);
  }

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) return reject(new Error("Cloudinary upload failed"));
          resolve(result);
        },
      );
      uploadStream.end(buffer);
    },
  );

  const updateProperty = await prisma.property.update({
    where: { id },
    data: {
      propertyImg: cloudinaryResult.secure_url,
      propertyImgPublicId: cloudinaryResult.public_id,
    },
  });

  return updateProperty;
};

export const propertyService = {
  createPropertyIntoDb,
  getAllPropertiesIntoDb,
  getSinglePropertyIntoDb,
  updatePropertyIntoDB,
  deletePropertyIntoDB,
  uploadPropertyImgIntoDB,
};
