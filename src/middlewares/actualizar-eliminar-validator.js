import { hash, verify } from "argon2";
import User from "./user.model.js";


export const handlePasswordChange = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        if (newPassword) {
            req.body.password = await hash(newPassword);
        }
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al procesar la nueva contraseña",
            error
        });
    }
};

export const verifyPasswordBeforeDelete = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                msg: "Debe ingresar su contraseña para desactivar su cuenta"
            });
        }

        const user = await User.findById(req.usuario._id);
        const isValidPassword = await verify(user.password, password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                msg: "La contraseña actual es incorrecta"
            });
        }

        next(); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al verificar la contraseña",
            error
        });
    }
};

export const checkPermissionToUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id; 
        const userRole = req.usuario.role; 
        const { password, newPassword } = req.body;

        const userToUpdateId = userRole === "CLIENT" ? userId.toString() : id;

        const existingUser = await User.findById(userToUpdateId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (userRole === "ADMIN" && req.body.role) {
            return next(); 
        } else if (userRole !== "ADMIN" && userId.toString() !== userToUpdateId) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para modificar este usuario"
            });
        }

       
        if (newPassword) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    msg: "Debe ingresar su contraseña actual para cambiarla"
                });
            }

           
            const isValidPassword = await verify(existingUser.password, password);
            if (!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    msg: "La contraseña actual es incorrecta"
                });
            }
        }

        req.userToUpdate = existingUser; 
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error en la verificación de permisos",
            error
        });
    }
};
