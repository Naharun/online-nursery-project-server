export type TPlant = {
  _id?: string;
  name: string;
  image: string;
  price: number;
  expected_dispatch_date: string;
  add_to_cart: boolean;
};

export type TCategory = {
  name: string;
  image: string;
  details: TPlant[]; 
};

export type TApiData = {
  flowers?: TCategory[];
  gardenDecor?: TCategory[];
  gifts?: TCategory[];
  pots?: TCategory[];
  season?: TCategory[];
  seeds?: TCategory[];
  otherCategories?: Record<string, TCategory[]>;
};

export interface IPlantDocument extends Document, TApiData {
  [x: string]: any;
}
