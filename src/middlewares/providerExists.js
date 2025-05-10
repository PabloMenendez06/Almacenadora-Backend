import Provider from "../providers/provider.model.js";

const providerExists = async (req, res, next) => {
  const { id } = req.params;

  try {
    const provider = await Provider.findById(id);

    if (!provider || provider.status === false) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado",
      });
    }

    req.provider = provider;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar el proveedor",
      error,
    });
  }
};

export default providerExists;
