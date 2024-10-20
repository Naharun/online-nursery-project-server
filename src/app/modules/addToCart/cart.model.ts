import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  product: any;
  quantity: any;
  _id?: string;
  name: string;
  price: number;
  image: string;
  expected_dispatch_date: string;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
}

const CartItemSchema: Schema = new Schema({
  _id: { type: String },
  name: { type: String },
  price: { type: Number },
  image: { type: String },
  expected_dispatch_date: { type: String },
});

const CartSchema: Schema = new Schema(
  {
    userId: { type: String },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
