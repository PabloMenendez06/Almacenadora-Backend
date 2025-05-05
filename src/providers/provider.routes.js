import { Router } from "express";
import { check } from "express-validator";
import {
  createProvider,
  updateProvider,
  listProviders,
  deleteProvider,
} from "./provider.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteProvider } from "../helpers/db-validator.js"; 

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo es obligatorio").not().isEmpty(),
    check("number", "El número de contacto es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createProvider
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteProvider),
    validarCampos,
  ],
  updateProvider
);

router.get("/", listProviders);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteProvider),
    validarCampos,
  ],
  deleteProvider
);

export default router;
