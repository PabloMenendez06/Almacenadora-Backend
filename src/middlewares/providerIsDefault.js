import Provider from "../providers/provider.model.js";

const providerIsDefault = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado",
      });
    }

    if (provider.name === "default") {
      return res.status(400).json({
        success: false,
        message: "No puedes modificar/eliminar el proveedor por defecto",
      });
    }

    next();
  } catch (error) {
    console.error("Error en providerIsDefault:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar si el proveedor es el predeterminado",
      error,
    });
  }
};

export default providerIsDefault;
