import { Query } from "pg";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IGetAllPropertiesQuery } from "./property.interface";

import { Prisma } from "../../generated/prisma/client";

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

const getAllPropertiesIntoDb = async (
  payload: IGetAllPropertiesQuery,
) => {
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

export const propertyService = {
  createPropertyIntoDb,
  getAllPropertiesIntoDb,
};
