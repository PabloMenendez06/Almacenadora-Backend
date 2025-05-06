export const requireCurrentPasswordIfChanging = (req, res, next) => {
    const { password, newPassword } = req.body;

    if (newPassword && !password) {
        return res.status(400).json({
            success: false,
            msg: "Debe ingresar su contraseña actual para cambiarla"
        });
    }

    next();
};
