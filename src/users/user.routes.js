import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  checkPermissionToUpdate,
  handlePasswordChange,
  verifyPasswordBeforeDelete,
} from "../middlewares/actualizar-eliminar-validator.js";

const router = Router();

router.put(
  "/editar/:id?",
  [
    validarJWT,
    check("id", "No es un ID válido").optional().isMongoId(),
    check("name", "El nombre es obligatorio").optional().notEmpty(),
    check("email", "El email no es válido").optional().isEmail(),
    check("newPassword", "La nueva contraseña debe tener al menos 8 caracteres")
      .optional()
      .isLength({ min: 8 }),
    validarCampos,
    checkPermissionToUpdate,   
    handlePasswordChange       
  ],
  updateUser
);


router.delete(
  "/eliminar/:id?",
  [
    validarJWT,
    check("id", "No es un ID válido").optional().isMongoId(),
    check("password", "La contraseña es obligatoria")
      .if((value, { req }) => req.usuario.role === "CLIENT")
      .notEmpty(),
    validarCampos,
    verifyPasswordBeforeDelete 
  ],
  deleteUser
);

export default router;
