import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.post("init", (doc) => {
  doc.image = process.env.BASE_URL + "Product/" + doc.image;
});

export const invoiceModel = mongoose.model("product", productSchema);
