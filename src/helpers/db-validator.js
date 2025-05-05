import User from '../users/user.model.js';
import Category from '../categories/category.model.js';
import Producto from '../products/product.model.js';
import Provider from "../providers/provider.model.js";
import Client from "../clients/client.model.js"



export const existenteEmail = async (email = '') =>{
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existenteCategory = async (name = '') =>{
    const existenteCategory = await Category.findOne({ name });

    if(existenteCategory){
        throw new Error(` ${ name } ya existe en la base de datos`);
    }
}

export const existenteProducto = async (name = '') =>{
    const existenteProducto = await Producto.findOne({ name });

    if(existenteProducto){
        throw new Error(` ${ name } ya existe en la base de datos`);
    }
}

export const existenteProvider = async (name = '') => {
    const existente = await Provider.findOne({ name });
  
    if (existente) {
      throw new Error(`El proveedor con nombre "${name}" ya existe en la base de datos`);
    }
  };

  export const existenteClient = async (nit = '') => {
    const cliente = await Client.findOne({ nit });
  
    if (cliente) {
      throw new Error(`El cliente con NIT ${nit} ya existe en la base de datos`);
    }
  };
  
export const existeClientById = async (id = '') => {
    const cliente = await Client.findById(id);
  
    if (!cliente) {
      throw new Error(`El cliente con ID ${id} no existe en la base de datos`);
    }
  };