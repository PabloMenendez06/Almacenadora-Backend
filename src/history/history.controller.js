import History from "./history.model.js"
import Product from "../products/product.model.js"

export const registerProduct = async (req, res) => {
  try {
    const { quantity, user, product, date } = req

    const newRegistration = new History({
      quantity,
      date,
      employee: user.id,
      product: product.id,
      productName: product.name,
      employeeName: user.name
    })

    await History.create(newRegistration)

    const stockRemaining = product.stock + quantity
    await Product.findByIdAndUpdate(product.id, { stock: stockRemaining }, { new: true })

    res.status(200).json({
      succes: true,
      message: "Products registered successfuly",
      newRegistration
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering the product",
      error,
    })
  }
}

export const withdrawProduct = async (req, res) => {
  try {
    const { quantity, user, product, date, body: { motive, destiny } } = req

    const newRegistration = new History({
      quantity: quantity * -1,
      motive,
      destiny,
      date,
      employee: user.id,
      product: product.id,
      productName: product.name,
      employeeName: user.name
    })

    await History.create(newRegistration)

    const stockRemaining = product.stock - quantity
    await Product.findByIdAndUpdate(product.id, { stock: stockRemaining }, { new: true })

    res.status(200).json({
      succes: true,
      message: "Products withdrawn successfuly",
      newRegistration
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error withdrawing the product",
      error,
    })
  }
}

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ status: true })
    res.status(200).json({
      success: true,
      mssg: "History found successfuly",
      history
    })
  } catch (error) {
    res.status(500).json({
      success: true,
      mssg: 'Error getting history',
      error
    })
  }
}