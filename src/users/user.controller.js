import { response } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";


export const updateUser = async (req, res) => {
    try {
        const { newPassword, role, ...data } = req.body;


        const existingUser = req.userToUpdate;
        const userToUpdateId = req.userToUpdateId;

        data.email = existingUser.email;

        if (newPassword) {
            data.password = await hash(newPassword);
        }

        const user = await User.findByIdAndUpdate(userToUpdateId, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado",
            user
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



export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.userToDeleteId);

        user.estado = false;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado",
            user
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


export const searchUser = async (req, res = response) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                msg: "El nombre es requerido para la búsqueda"
            });
        }

        const users = await User.find({
            name: { $regex: name, $options: "i" },
            estado: true
        });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.error("Error en searchUser:", error);

        res.status(500).json({
            success: false,
            msg: "Error al buscar usuarios",
            error: error.message || error
        });
    }
};
