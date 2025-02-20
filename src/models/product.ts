import mongoose from "mongoose";
import { trim } from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    photo: {
      type: String,
      required: [true, "Please Enter Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter price"],
    },
    stock: {
      type: String,
      required: [true, "Please Enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please Enter Category"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", schema);

export default Products;
