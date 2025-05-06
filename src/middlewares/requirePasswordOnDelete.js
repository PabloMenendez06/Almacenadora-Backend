export const requirePasswordOnDelete = (req, res, next) => {
    const userRole = req.usuario.role;
    const { password } = req.body;

    if (userRole === "USER" && !password) {
        return res.status(400).json({
            success: false,
            msg: "Debe ingresar su contraseña para desactivar su cuenta"
        });
    }

    next();
};
