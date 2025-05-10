import { Router } from "express";
import { check } from "express-validator";
import {
  createClient,
  updateClient,
  listClients,
  deleteClient,
} from "./client.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteClient } from "../helpers/db-validator.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo electrónico es obligatorio").isEmail(),
    check("nit", "El NIT es obligatorio").not().isEmpty(),
    check("phone", "El teléfono es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createClient
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteClient),
    check("email", "El correo electrónico es obligatorio").isEmail(),
    check("phone", "El teléfono es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateClient
);

router.get("/", listClients);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteClient),
    validarCampos,
  ],
  deleteClient
);

export default router;
