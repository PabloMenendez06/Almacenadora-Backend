import Client from "./client.model.js";
import {
  validateCreateClient,
  validateUpdateClient,
  validateDeleteClient,
} from "../middlewares/validar-client.js";

export const createClient = async (req, res) => {
  await validateCreateClient(req, res);
  if (res.statusCode !== 200) return;

  try {
    const { name, email, nit, phone } = req.body;

    const client = new Client({ name, email, nit, phone });
    await client.save();

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el cliente",
      error,
    });
  }
};

export const updateClient = async (req, res) => {
  await validateUpdateClient(req, res);
  if (res.statusCode !== 200) return;

  try {
    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      client: req.updatedClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el cliente",
      error,
    });
  }
};

export const listClients = async (req, res) => {
  try {
    const clients = await Client.find({ status: true });

    res.json({
      success: true,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los clientes",
      error,
    });
  }
};

export const deleteClient = async (req, res) => {
  await validateDeleteClient(req, res);
  if (res.statusCode !== 200) return;

  try {
    res.status(200).json({
      success: true,
      message: "Cliente eliminado exitosamente",
      client: req.updatedClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar cliente",
      error,
    });
  }
};
