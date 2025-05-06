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
import  providerExists  from "../middlewares/providerExists.js"; 
import providerIsDefault from "../middlewares/providerIsDefault.js";
import {validateProviderFields} from "../middlewares/validateProviderFields.js";
import { validateUpdateProviderFields } from "../middlewares/validateUpdateProviderFields.js"; 
import { providerNameExists } from "../middlewares/providerNameExists.js"; 

const router = Router();


router.post(
  "/",
  [
    validarJWT,
    validateProviderFields,  
    providerNameExists,             
    validarCampos,
  ],
  createProvider
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    providerExists,                
    providerIsDefault,             
    validateUpdateProviderFields,  
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
    providerExists,                
    validarCampos,
  ],
  deleteProvider
);

export default router;
