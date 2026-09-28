import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyCategory,
  IUpdatePropertyCategory,
} from "./propertyCategory.interface";

const createPropertyCategoryIntoDB = async (
  payload: ICreatePropertyCategory,
) => {
  const { name, slug, description, isActive, sortOrder } = payload;

  const result = await prisma.propertyCategory.create({
    data: {
      name,
      slug,
      description,
      isActive,
      sortOrder,
    },
  });
  return result;
};

const getAllPropertyCategoryIntoDB = async () => {
  const result = await prisma.propertyCategory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getPropertyCategoryByIdIntoDB = async (id: string) => {
  const result = await prisma.propertyCategory.findUnique({
    where: { id },
  });
  if (!result) {
    throw new Error("Property category not found");
  }

  return result;
};

const updatePropertyCategoryIntoDB = async (
  id: string,
  payload: IUpdatePropertyCategory,
) => {
  const isPropertyCategoryExists = await prisma.propertyCategory.findUnique({
    where: { id },
  });
  if (!isPropertyCategoryExists) {
    throw new Error("Property category does not exist");
  }

  const updatePropertyCategory = await prisma.propertyCategory.update({
    where: { id },
    data: {
      ...payload,
    },
  });

  return updatePropertyCategory;
};

export const propertyCategoryService = {
  createPropertyCategoryIntoDB,
  getAllPropertyCategoryIntoDB,
  getPropertyCategoryByIdIntoDB,
  updatePropertyCategoryIntoDB,
};
