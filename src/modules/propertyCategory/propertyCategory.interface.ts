export interface ICreatePropertyCategory {
  name: string;
  slug: string;
  description?: string;

  isActive?: boolean;
  sortOrder?: number;
}



export interface IUpdatePropertyCategory {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}
