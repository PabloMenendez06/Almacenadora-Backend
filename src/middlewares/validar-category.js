import Category from "../categories/category.model.js";
import Product from "../products/product.model.js";

export const validateCreateCategory = async (req, res) => {
  const { name } = req.body;
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    res.status(400).json({
      success: false,
      message: "La categoría ya existe",
    });
  }
};

export const validateUpdateCategory = async (req, res) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedCategory) {
    res.status(404).json({
      success: false,
      message: "Categoría no encontrada",
    });
  } else {
    req.updatedCategory = updatedCategory;
  }
};

export const validateDeleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({
      success: false,
      message: "Categoría no encontrada",
    });
    return;
  }

  const defaultCategory = await Category.findOne({ name: "default" });
  if (!defaultCategory) {
    res.status(500).json({
      success: false,
      message: "No se encontró la categoría por defecto. No se puede proceder con la eliminación.",
    });
    return;
  }

  await Product.updateMany({ category: id }, { category: defaultCategory._id });

  const updatedCategory = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

  req.updatedCategory = updatedCategory;
};
