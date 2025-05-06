import { verify } from "argon2";

export const verifyPasswordOnDelete = async (req, res, next) => {
    const userRole = req.usuario.role;

    if (userRole !== "USER") return next(); 

    const { password } = req.body;
    const user = req.userToUpdate; 

    try {
        const esIgual = await verify(user.password, password);
        if (!esIgual) {
            return res.status(400).json({
                success: false,
                msg: "La contraseña actual es incorrecta"
            });
        }

        next();
    } catch (error) {
        console.error("Error al verificar contraseña:", error);
        res.status(500).json({
            success: false,
            msg: "Error al verificar contraseña",
            error
        });
    }
};
