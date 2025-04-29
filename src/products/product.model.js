import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      maxLength: [100, "No más de 100 caracteres"],
      minLength: [2, "Mínimo 2 caracteres"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      maxLength: [1000, "No más de 1000 caracteres"],
      minLength: [10, "Mínimo 10 caracteres"],
      trim: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "El proveedor es requerido"],
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      min: [0, "El stock no puede ser negativo"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es requerida"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    entryDate: {
      type: Date,
      required: [true, "La fecha de entrada es requerida"],
    },
    exitDate: {
      type: Date,
      default: null, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Product", ProductSchema);

