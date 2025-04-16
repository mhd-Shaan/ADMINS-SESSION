import mongoose from "mongoose";

const SubBrandSchema = new mongoose.Schema(
  {
    brandId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "SubBrand name is required"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "SubBrand image is required"],
    },
    type: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SubBrands = mongoose.model("Subbrands", SubBrandSchema);

export default SubBrands;
