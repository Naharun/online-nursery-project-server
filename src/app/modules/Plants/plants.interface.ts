export type TPlant = {
  _id: string;
  name: string;
  image: string;
  price: string;
  expected_dispatch_date: string;
  add_to_cart: boolean;
};

export type TCategory = {
  name: string;
  image: string;
  details: TPlant[];
};

export type TApiData = {
  [key: string]: TCategory[];
};
