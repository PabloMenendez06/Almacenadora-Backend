import Category from "../categories/category.model.js";
import Provider from "../providers/provider.model.js";
import { parseDate } from "./parseDate.js";

export const validateProductFields = async (body) => {
  const {
    name,
    description,
    provider,
    price,
    stock,
    category,
    entryDate,
    expirationDate,
  } = body;

  if (!name || !description || !provider || !price || !stock || !category || !entryDate || !expirationDate) {
    return { valid: false, status: 400, message: "Todos los campos son obligatorios" };
  }

  if (description.length < 10) {
    return { valid: false, status: 400, message: "La descripción debe tener al menos 10 caracteres" };
  }

  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    return { valid: false, status: 404, message: "Categoría no encontrada" };
  }

  const providerFound = await Provider.findOne({ name: provider });
  if (!providerFound) {
    return { valid: false, status: 404, message: "Proveedor no encontrado" };
  }

  // Verificar que el proveedor tiene el status 'true'
  if (providerFound.status === false) {
    return { valid: false, status: 400, message: "El proveedor está inactivo" };
  }

  const parsedEntryDate = parseDate(entryDate);
  const parsedExpirationDate = parseDate(expirationDate);

  if (isNaN(parsedEntryDate) || isNaN(parsedExpirationDate)) {
    return { valid: false, status: 400, message: "Las fechas ingresadas no son válidas" };
  }

  return {
    valid: true,
    category: categoryFound,
    provider: providerFound,
    parsedEntryDate,
    parsedExpirationDate,
  };
};
