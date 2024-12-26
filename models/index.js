const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LaptopSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance"],
      required: true,
      default: "available",
    },
    purchaseDate: { type: Date, required: true },
  },
  { strict: false, timestamps: true }
);
const LaptopModel = mongoose.model("Laptop", LaptopSchema);
module.exports = { LaptopModel };
