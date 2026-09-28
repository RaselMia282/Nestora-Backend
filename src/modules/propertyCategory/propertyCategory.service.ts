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

const deletePropertyCategoryIntoDB = async (id: string) => {
  const isCategoryExists = await prisma.propertyCategory.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          properties: true,
        },
      },
    },
  });

  if (!isCategoryExists) {
    throw new Error("Category does not exist");
  }

  if (isCategoryExists._count.properties > 0) {
    throw new Error("Cannot delete category because properties exist");
  }

  const deleteCategory = await prisma.propertyCategory.delete({
    where: { id },
  });

  return deleteCategory;
};

export const propertyCategoryService = {
  createPropertyCategoryIntoDB,
  getAllPropertyCategoryIntoDB,
  getPropertyCategoryByIdIntoDB,
  updatePropertyCategoryIntoDB,
  deletePropertyCategoryIntoDB,
};
