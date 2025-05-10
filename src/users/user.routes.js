import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser, searchUser } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeUsuarioById } from "../helpers/db-validator.js";

import { userExists } from "../middlewares/userExists.js";
import { validateUserUpdatePermissions } from "../middlewares/validateUserUpdatePermissions.js";
import { requireCurrentPasswordIfChanging } from "../middlewares/requireCurrentPasswordIfChanging.js";
import { verifyCurrentPassword } from "../middlewares/verifyCurrentPassword.js";
import { validateDeletePermissions } from "../middlewares/validateDeletePermissions.js";
import { requirePasswordOnDelete } from "../middlewares/requirePasswordOnDelete.js";
import { verifyPasswordOnDelete } from "../middlewares/verifyPasswordOnDelete.js";

const router = Router();

router.put(
    "/editar/:id?",
    [
        validarJWT,
        check("id", "No es un ID válido").optional().isMongoId(),
        check("name", "El nombre es obligatorio").optional().notEmpty(),
        check("email", "El email no es válido").optional().isEmail(),
        check("newPassword", "La nueva contraseña debe tener al menos 8 caracteres").optional().isLength({ min: 8 }),
        validarCampos,

        userExists,
        validateUserUpdatePermissions,
        requireCurrentPasswordIfChanging,
        verifyCurrentPassword
    ],
    updateUser
);




router.delete(
    "/eliminar/:id?",
    [
        validarJWT,
        check("id", "No es un ID válido").optional().isMongoId(),
        validarCampos,
        userExists,
        validateDeletePermissions,
        requirePasswordOnDelete,
        verifyPasswordOnDelete
    ],
    deleteUser
);

router.get("/search", searchUser);



export default router;