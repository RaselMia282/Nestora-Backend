export interface ICreateListing {
  roomId: string;
  title: string;
  description: string;
}


export interface IUpdateListing {
  title?: string;
  description?: string;
  isPublished?: boolean;
}