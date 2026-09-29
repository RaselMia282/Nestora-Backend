export interface ICreateProperty {
  categoryId: string;
//   ownerId: string;
  title: string;
  description?: string;
  address: string;
  city: string;
}


export interface IGetAllPropertiesQuery {
  page?: number;
  limit?: number;
  search?: string;
  address?:string;
  categoryId?: string;
  city?: string;
  
  sort?: "latest" | "oldest";
}