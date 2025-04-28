import { response } from "express";
import User from "./user.model.js";

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id;  

        const userToUpdateId = id || userId;

        const userToUpdate = await User.findById(userToUpdateId);
        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }


        if (userId.toString() !== userToUpdateId.toString() && req.usuario.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para modificar este usuario"
            });
        }

        const data = { ...req.body, email: userToUpdate.email };

        const updatedUser = await User.findByIdAndUpdate(userToUpdateId, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error
        });
    }
};


export const deleteUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        userToDelete.estado = false;
        await userToDelete.save();

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado",
            user: userToDelete
        });
    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({
            success: false,
            msg: "Error al desactivar usuario",
            error: error.message || error
        });
    }
};

