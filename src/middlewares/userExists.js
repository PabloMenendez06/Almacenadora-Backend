import User from "../users/user.model.js";

export const userExists = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id;
        const userRole = req.usuario.role;
        const userToUpdateId = userRole === "USER" ? userId.toString() : id;

        const existingUser = await User.findById(userToUpdateId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        req.userToUpdate = existingUser;
        req.userToUpdateId = userToUpdateId;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al verificar usuario"
        });
    }
};
