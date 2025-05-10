import Category from "../categories/category.model.js";
import Provider from "../providers/provider.model.js";
import { parseDate } from "./parseDate.js";

export const validateUpdateProductFields = async (body) => {
  const {
    name,
    description,
    provider,
    price,
    stock,
    category,
    entryDate,
    exitDate,
    expirationDate,
  } = body;

  const updateData = {};

  if (name) updateData.name = name;
  if (description) {
    if (description.length < 10) {
      return { valid: false, status: 400, message: "La descripción debe tener al menos 10 caracteres" };
    }
    updateData.description = description;
  }

  if (price !== undefined) updateData.price = price;
  if (stock !== undefined) updateData.stock = stock;

  if (provider) {
    const providerFound = await Provider.findOne({ name: provider });
    if (!providerFound) {
      return { valid: false, status: 404, message: "Proveedor no encontrado" };
    }
    
    if (providerFound.status === false) {
      return { valid: false, status: 400, message: "El proveedor está inactivo" };
    }
    updateData.provider = providerFound._id;
  }

  if (category) {
    const categoryFound = await Category.findOne({ name: category });
    if (!categoryFound) {
      return { valid: false, status: 404, message: "Categoría no encontrada" };
    }
    updateData.category = categoryFound._id;
  }

  if (entryDate) {
    const parsed = parseDate(entryDate);
    if (isNaN(parsed)) {
      return { valid: false, status: 400, message: "La fecha de entrada no es válida" };
    }
    updateData.entryDate = parsed;
  }

  if (exitDate) {
    const parsed = parseDate(exitDate);
    if (isNaN(parsed)) {
      return { valid: false, status: 400, message: "La fecha de salida no es válida" };
    }
    updateData.exitDate = parsed;
  }

  if (expirationDate) {
    const parsed = parseDate(expirationDate);
    if (isNaN(parsed)) {
      return { valid: false, status: 400, message: "La fecha de expiración no es válida" };
    }
    updateData.expirationDate = parsed;
  }

  return {
    valid: true,
    updateData,
  };
};
