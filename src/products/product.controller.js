import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import Provider from "../providers/provider.model.js";


const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const saveProduct = async (req, res) => {
    try {
      const { name, description, provider, price, stock, category, entryDate, expirationDate } = req.body;
  
      if (!name || !description || !provider || !price || !stock || !category || !entryDate || !expirationDate) {
        return res.status(400).json({
          success: false,
          message: "Todos los campos son obligatorios",
        });
      }
  
      const categoryFound = await Category.findOne({ name: category });
      const providerFound = await Provider.findOne({ name: provider });
  
      if (!categoryFound) {

        return res.status(404).json({ success: false, message: "Categoría no encontrada" });
      }
  
      if (!providerFound) {
        return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
      }
  
      const parsedEntryDate = parseDate(entryDate);
      const parsedExpirationDate = parseDate(expirationDate);
  
      const product = new Product({
        name,

        description,
        provider: providerFound._id,
        price,
        stock,
        category: categoryFound._id,  
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
      res.status(500).json({
        success: false,
        message: "Error al crear el producto",
        error,
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
      const { name, description, provider, price, stock, category, entryDate, exitDate, expirationDate } = req.body;
  
      const updateData = {};
  
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (stock !== undefined) updateData.stock = stock;
  
      if (provider) {
        const providerFound = await Provider.findOne({ name: provider });
        if (!providerFound) {
          return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
        }
        updateData.provider = providerFound._id;
      }
  
      if (category) {
        const categoryFound = await Category.findOne({ name: category });
        if (!categoryFound) {
          return res.status(404).json({ success: false, message: "Categoría no encontrada" });
        }
        updateData.category = categoryFound._id;
      }
  
      if (entryDate) updateData.entryDate = parseDate(entryDate);
      if (exitDate) updateData.exitDate = parseDate(exitDate);
      if (expirationDate) updateData.expirationDate = parseDate(expirationDate);
  
      const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  
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

