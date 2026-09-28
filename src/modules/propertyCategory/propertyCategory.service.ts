import { prisma } from "../../lib/prisma";
import { ICreatePropertyCategory } from "./propertyCategory.interface";

const createPropertyCategoryIntoDB = async (payload: ICreatePropertyCategory) => {
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

const getAllPropertyCategoryIntoDB = async()=>{
    const result = await prisma.propertyCategory.findMany({
        where:{
            createdAt:"desc"
        }
    })

    return result 
}

export const propertyCategoryService = {
  createPropertyCategoryIntoDB,
  getAllPropertyCategoryIntoDB,
};
