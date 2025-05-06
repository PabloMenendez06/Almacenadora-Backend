import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import Provider from "../providers/provider.model.js";
import { validateProductFields } from "../middlewares/validateProductFields.js";
import { validateUpdateProductFields } from "../middlewares/validateUpdateProductFields.js";


export const saveProduct = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body);

    const validation = await validateProductFields(req.body);

    if (!validation.valid) {
      return res.status(validation.status).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      category,
      provider,
      parsedEntryDate,
      parsedExpirationDate,
    } = validation;

    const product = new Product({
      ...req.body,
      provider: provider._id,
      category: category._id,
      entryDate: parsedEntryDate,
      expirationDate: parsedExpirationDate,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al crear el producto",
    });
  }
};
  

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: true })
      .populate("category", "name")
      .populate("provider", "name email number");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error,
    });
  }
};

export const recentProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: true })
      .sort({ entryDate: -1 })
      .limit(10)
      .populate("category", "name")
      .populate("provider", "name");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener productos recientes",
      error,
    });
  }
};

export const searchProductsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const regex = new RegExp(name, "i");

    const products = await Product.find({ name: regex, status: true })
      .populate("category", "name")
      .populate("provider", "name");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar productos por nombre",
      error,
    });
  }
};

export const filterProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });

    if (!category) {
      return res.status(404).json({ success: false, message: `Categoría '${categoryName}' no encontrada` });
    }

    const products = await Product.find({ category: category._id, status: true })
      .populate("category", "name")
      .populate("provider", "name");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al filtrar productos por categoría",
      error,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const validation = await validateUpdateProductFields(req.body);

    if (!validation.valid) {
      return res.status(validation.status).json({
        success: false,
        message: validation.message,
      });
    }

    const product = await Product.findByIdAndUpdate(id, validation.updateData, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({
      success: true,
      message: "Producto actualizado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error,
    });
  }
};

  

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false });

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
      error,
    });
  }
};

