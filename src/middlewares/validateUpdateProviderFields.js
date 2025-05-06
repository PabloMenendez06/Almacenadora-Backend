import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";

export const validateUpdateProviderFields = [
  check("name", "El nombre es obligatorio").notEmpty(),
  check("email", "El email es obligatorio").notEmpty(),
  check("email", "El email no es válido").isEmail(),
  check("number", "El número es obligatorio").notEmpty(),
  validarCampos
];
