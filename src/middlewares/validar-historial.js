import Product from "../products/product.model.js"

export const validateRegisterProduct = async (req, res) => {
  const token = await req.header('x-token')
  const { id } = req.params
  const { quantity } = req.body

  if (!quantity || !id) {
    return res.status(400).json({
      success: false,
      message: "The fields quantity and product id are obligatory",
    })
  }

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion'
    })
  }
}

export const validateWithdrawProduct = async (req, res) => {
  const token = await req.header('x-token')
  const { id } = req.params
  const { quantity } = req.body

  if (!quantity || !id) {
    return res.status(400).json({
      success: false,
      message: "The fields quantity and product id are obligatory",
    })
  }

  if (quantity <= 0) {
    return res.status(401).json({
      msg: 'Set a valid quantity'
    })
  }

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion'
    })
  }
  const chosenProduct = await Product.findById(id)
  if ((chosenProduct.stock - quantity) < 0) {
    return res.status(500).json({
      success: false,
      message: "The quantity that you are requesting is too big for the stock of the product."
    })
  }
}