import Provider from "../providers/provider.model.js";

export const providerNameExists = async (req, res, next) => {
  const { name } = req.body;

  const existingProvider = await Provider.findOne({ name });
  if (existingProvider) {
    return res.status(400).json({
      success: false,
      message: "El nombre del proveedor ya está en uso"
    });
  }

  next();
};
