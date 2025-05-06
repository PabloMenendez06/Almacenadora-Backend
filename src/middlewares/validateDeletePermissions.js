export const validateDeletePermissions = (req, res, next) => {
    const userId = req.usuario._id.toString();
    const userRole = req.usuario.role;
    const userToDeleteId = req.params.id ? req.params.id.toString() : userId;

    if (userRole !== "ADMIN" && userId !== userToDeleteId) {
        return res.status(403).json({
            success: false,
            msg: "No tienes permisos para eliminar este usuario"
        });
    }

    req.userToDeleteId = userToDeleteId;
    next();
};
