import Client from "./client.model.js";

export const createClient = async (req, res) => {
  try {
    const { name, email, nit, phone } = req.body;

    const existingClient = await Client.findOne({ nit });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "El cliente con este NIT ya existe",
      });
    }

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
  try {
    const { id } = req.params;

    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      client: updatedClient,
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
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cliente eliminado exitosamente",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar cliente",
      error,
    });
  }
};
