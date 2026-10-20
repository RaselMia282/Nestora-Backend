export interface ICreateProperty {
  categoryId: string;
//   ownerId: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
}


export interface IGetAllPropertiesQuery {
  page?: number;
  limit?: number;
  search?: string;
  address?:string;
  categoryId?: string;
  city?: string;
  category?:string;
  sort?: "latest" | "oldest";
}


export interface IUpdateProperty {
  categoryId?: string;
  title?: string;
  description?: string;
  address?: string;
  city?: string;
}