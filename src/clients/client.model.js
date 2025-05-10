import { Schema, model } from "mongoose";

const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del cliente es requerido"],
      maxLength: [100, "No más de 100 caracteres"],
      minLength: [3, "Mínimo 3 caracteres"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es requerido"],
      trim: true,
    },
    nit: {
      type: String,
      required: [true, "El NIT es requerido"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "El número de teléfono es requerido"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Client", ClientSchema);
