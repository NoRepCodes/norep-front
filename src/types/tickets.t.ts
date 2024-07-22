export type TicketT = {
  _id: string;
  users: {
    _id:string,
    name:string
  }[];
  secure_url: string;
  public_id: string;
  transf: string;
  phone: string;
  event: string;
  category: string;
  category_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
