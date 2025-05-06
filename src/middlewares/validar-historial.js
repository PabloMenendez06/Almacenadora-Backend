import jwt from "jsonwebtoken"
import User from "../users/user.model.js"
import Product from "../products/product.model.js"

export const validateRegisterProduct = async (req, res) => {
  const token = await req.header('x-token')
  const { id } = req.params
  const { quantity } = req.body

  if (!quantity || !id) {
    res.status(400).json({
      success: false,
      message: "The fields quantity and product id are obligatory",
    })
    return
  }

  if (!token) {
    res.status(401).json({
      msg: 'No hay token en la peticion'
    })
    return
  }

  const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
  const currentUser = await User.findById(uid)
  const chosenProduct = await Product.findById(id)

  req.user = currentUser
  req.product = chosenProduct
  req.date = new Date().toISOString().replace('Z', '+00:00')
}

export const validateWithdrawProduct = async (req, res) => {
  const token = await req.header('x-token')
  const { id } = req.params
  const { quantity } = req.body

  if (!quantity || !id) {
    res.status(400).json({
      success: false,
      message: "The fields quantity and product id are obligatory",
    })
    return
  }

  if (quantity <= 0) {
    res.status(401).json({
      msg: 'Set a valid quantity'
    })
    return
  }

  if (!token) {
    res.status(401).json({
      msg: 'No hay token en la peticion'
    })
    return
  }

  const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
  const currentUser = await User.findById(uid)
  const chosenProduct = await Product.findById(id)

  if ((chosenProduct?.stock - quantity) <= 0) {
    res.status(500).json({
      success: false,
      message: "The quantity that you are requesting is too big for the stock of the product."
    })
    return
  }

  req.user = currentUser
  req.product = chosenProduct
  req.date = new Date().toISOString().replace('Z', '+00:00')
}
