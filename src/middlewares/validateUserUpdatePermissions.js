export const validateUserUpdatePermissions = (req, res, next) => {
    const { role: requestedRole } = req.body;
    const { _id: userId, role: userRole } = req.usuario;
    const userToUpdateId = req.userToUpdateId;

    if (userRole === "ADMIN") {
        if (requestedRole) {
            req.body.role = requestedRole;
        }
    } else if (userId.toString() !== userToUpdateId) {
        return res.status(403).json({
            success: false,
            msg: "No tienes permisos para modificar este usuario"
        });
    }

    next();
};
