import { verify } from "argon2";

export const verifyCurrentPassword = async (req, res, next) => {
    const { password, newPassword } = req.body;

    if (!newPassword) return next();

    const existingUser = req.userToUpdate;

    try {
        const esIgual = await verify(existingUser.password, password);
        if (!esIgual) {
            return res.status(400).json({
                success: false,
                msg: "La contraseña actual es incorrecta"
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al verificar contraseña"
        });
    }
};
