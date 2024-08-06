export type TicketT = {
  _id: string;
  users: {
    _id:string,
    name:string
  }[];
  
  phone: string;
  event: string;
  category: string;
  category_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  duesLimit: number;
  dues:{
    secure_url: string;
    public_id: string;
    transf: string;
    payDues: number,
  }[]
};
