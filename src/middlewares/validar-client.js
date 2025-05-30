import Client from "../clients/client.model.js";

export const validateCreateClient = async (req, res) => {
  const { nit } = req.body;
  const existingClient = await Client.findOne({ nit });

  if (existingClient) {
    res.status(400).json({
      success: false,
      message: "El cliente con este NIT ya existe",
    });
  }
};

export const validateUpdateClient = async (req, res) => {
  const { id } = req.params;
  const { nit, ...data } = req.body;
  const existingClient = await Client.findOne({ nit });
  console.log(existingClient)
  if (existingClient) {
    return res.status(400).json({
      success: false,
      message: "El cliente con este NIT ya existe",
    });
  }
  const updatedClient = await Client.findByIdAndUpdate(id, {data}, { new: true }); 
  await Client.findByIdAndUpdate(id, {nit}, { new: true }); 

  if (!updatedClient) {
    res.status(404).json({
      success: false,
      message: "Cliente no encontrado",
    });
  } else {
    req.updatedClient = updatedClient;
  }
};

export const validateDeleteClient = async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id);
  if (!client) {
    res.status(404).json({
      success: false,
      message: "Cliente no encontrado",
    });
    return;
  }

  const updatedClient = await Client.findByIdAndUpdate(id, { status: false }, { new: true });

  req.updatedClient = updatedClient;
};
