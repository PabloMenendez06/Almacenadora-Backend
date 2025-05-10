import Category from "./category.model.js";
import Product from "../products/product.model.js";
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateDeleteCategory,
} from "../middlewares/validar-category.js";

export const createCategory = async (req, res) => {
  await validateCreateCategory(req, res);
  if (res.headersSent) return;

  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      error,
    });
  }
};

export const updateCategory = async (req, res) => {
  await validateUpdateCategory(req, res);
  if (res.headersSent) return;

  try {
    res.json({
      success: true,
      message: "Categoría actualizada exitosamente",
      category: req.updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error,
    });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error,
    });
  }
};

export const deleteCategory = async (req, res) => {
  await validateDeleteCategory(req, res);
  if (res.headersSent) return;

  try {
    res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente. Productos reasignados a la categoría por defecto.",
      category: req.updatedCategory,
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar categoría",
      error,
    });
  }
};