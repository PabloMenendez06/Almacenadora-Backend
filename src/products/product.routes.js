import { Router } from "express";
import { saveProduct, listProducts, recentProducts, searchProductsByName, filterProductsByCategory, updateProduct, deleteProduct } from "./product.controller.js";

import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existenteProducto } from "../helpers/db-validator.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    validarCampos,
  ],
  saveProduct
);

router.get("/", listProducts);


router.get("/recentEgresed", recentProducts);

router.get("/search/:name", searchProductsByName);


router.get("/category/:categoryName", filterProductsByCategory);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteProducto),
    validarCampos,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existenteProducto),
    validarCampos,
  ],
  deleteProduct
);

export default router;
