import { Router } from "express";
import { check } from "express-validator";
import {
  createCategory,
  updateCategory,
  listCategories,
  deleteCategory,
} from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteCategory } from "../helpers/db-validator.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteCategory),
    validarCampos,
  ],
  updateCategory
);

router.get("/", listCategories);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteCategory),
    validarCampos,
  ],
  deleteCategory
);

export default router;
