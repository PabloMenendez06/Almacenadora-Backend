import Provider from "./provider.model.js";
import Product from "../products/product.model.js";

export const createProvider = async (req, res) => {
  try {
    const { name, email, number } = req.body;

    const provider = new Provider({ name, email, number });
    await provider.save();

    res.status(201).json({
      success: true,
      message: "Proveedor creado exitosamente",
      provider,
    });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el proveedor",
      error: error.message || error,
    });
  }
};


export const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number } = req.body;

    const updatedProvider = await Provider.findByIdAndUpdate(id, { name, email, number }, {
      new: true,
    });

    if (!updatedProvider) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Proveedor actualizado exitosamente",
      provider: updatedProvider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el proveedor",
      error,
    });
  }
};


export const listProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ status: true });

    res.json({
      success: true,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los proveedores",
      error,
    });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = req.provider; 

    const defaultProvider = await Provider.findOne({ name: "default" });
    if (!defaultProvider) {
      return res.status(500).json({
        success: false,
        message: "No se encontró el proveedor por defecto. No se puede proceder con la eliminación.",
      });
    }

    await Product.updateMany(
      { provider: id },
      { provider: defaultProvider._id }
    );

    const updatedProvider = await Provider.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Proveedor eliminado exitosamente. Productos reasignados al proveedor por defecto.",
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar proveedor",
      error,
    });
  }
};

