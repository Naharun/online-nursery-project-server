// TPlant and TCategory remain unchanged
export type TPlant = {
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

// Keep TApiData as a type
export type TApiData = {
  flowers?: TCategory[];
  gardenDecor?: TCategory[];
  gifts?: TCategory[];
  pots?: TCategory[];
  season?: TCategory[];
  seeds?: TCategory[];
  otherCategories?: Record<string, TCategory[]>;
};

// Define IPlantDocument by combining TApiData and Document using the intersection operator (&)
export interface IPlantDocument extends Document, TApiData {
  [x: string]: any;
  // No need to add additional fields as TApiData covers them
}
