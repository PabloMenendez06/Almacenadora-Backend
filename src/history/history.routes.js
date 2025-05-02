import { Router } from "express";
import { registerProduct, withdrawProduct, getHistory } from "./history.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteProducto } from "../helpers/db-validator.js";

const router = Router();

router.get('/get-history/', getHistory)

router.post(
  "/register-product/:id",
  [
    validarJWT,
    validarCampos,
  ],
  registerProduct
)

router.post(
  "/withdraw-product/:id",
  [
    validarJWT,
    validarCampos,
  ],
  withdrawProduct
)

export default router;
