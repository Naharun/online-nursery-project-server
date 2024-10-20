export interface ICartItem {
  quantity: any;
  _id?: string;
  name: string;
  price: number;
  image: string;
  expected_dispatch_date: string;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
}
