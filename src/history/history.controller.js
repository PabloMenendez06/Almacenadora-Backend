import User from "../users/user.model.js"
import Product from "../products/product.model.js"
import History from "./history.model.js"
import jwt from "jsonwebtoken"

export const registerProduct = async (req, res) => {
  try {
    console.log("registerProduct")
    const token = await req.header('x-token')
    const { id } = req.params
    const { quantity } = req.body

    if (!quantity || !id) {
      return res.status(400).json({
        success: false,
        message: "The fields quantity and product id are obligatory",
      })
    }
  
    if(!token){
      return res.status(401).json({
        msg: 'No hay token en la peticion'
      })
    }
    
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    console.log()
    
    const currentUser = await User.findById(uid)
    const chosenProduct = await Product.findById(id)
    const currentDate = new Date()
    const isoString = currentDate.toISOString()
    const currentDateWFormat = isoString.replace('Z', '+00:00')
    console.log(currentUser)
    console.log(chosenProduct)
    if(currentUser){
      const newRegistration = new History({
        quantity,
        date: currentDateWFormat,
        employee: currentUser.id,
        product: chosenProduct.id,
        productName: chosenProduct.name,
        employeeName: currentUser.name
      })
      await History.create(newRegistration)
      const stockProduct = chosenProduct.stock
      const stockRemaining = stockProduct + quantity
      await Product.findByIdAndUpdate(id,{ stock : stockRemaining }, {new:true})
      res.status(200).json({
        succes: true,
        message: "Products registered successfuly",
        newRegistration
      })
    } else{
      res.status(500).json({
        success: false,
        message: "You are not allowed to do that"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering the product",
      error,
    });
  }
}

export const withdrawProduct = async (req, res) => {
  try {
    console.log("withdrawProduct")
    const token = await req.header('x-token')
    const { id } = req.params
    const { quantity, motive, destiny } = req.body
    if (!quantity || !id) {
      return res.status(400).json({
        success: false,
        message: "The fields quantity and product id are obligatory",
      })
    }

    if(quantity <= 0){
      return res.status(401).json({
        msg: 'Set a valid quantity'
      })
    }

  
    if(!token){
      return res.status(401).json({
        msg: 'No hay token en la peticion'
      })
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    const currentUser = await User.findById(uid)
    const chosenProduct = await Product.findById(id)
    const currentDate = new Date()
    const isoString = currentDate.toISOString()
    const currentDateWFormat = isoString.replace('Z', '+00:00')
    if(currentUser){
      const newRegistration = new History({
        quantity: quantity*-1,
        motive,
        destiny,
        date: currentDateWFormat,
        employee: currentUser.id,
        product: chosenProduct.id,
        productName: chosenProduct.name,
        employeeName: currentUser.name
      })
      await History.create(newRegistration)
      const stockProduct = chosenProduct.stock
      let stockRemaining = 0
      if((stockProduct - quantity) > 0) {
        stockRemaining = stockProduct - quantity
        await Product.findByIdAndUpdate(id,{ stock : stockRemaining }, {new:true})
        res.status(200).json({
          succes: true,
          message: "Products withdrawn successfuly",
          newRegistration
        })
      } else {
        res.status(500).json({
          success: false,
          message: "The quantity that you are requesting is too big for the stock of the product."
        }); 
      }
    } else{
      res.status(500).json({
        success: false,
        message: "You are not allowed to do that"
      });
    } 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error withdrawing the product",
      error,
    });
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