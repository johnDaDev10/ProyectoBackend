import { CartModel } from '../../models/cart.model.js'

class CartManager {
  async getCarts() {
    try {
      const carts = await CartModel.find()
      return {
        code: 200,
        status: true,
        message: `All carts found`,
        data: carts,
      }
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation error`,
        data: error.message,
      }
    }
  }

  async addCart() {
    try {
      const newCart = await CartModel.create({})
      return {
        code: 201,
        status: true,
        message: `Successfully added`,
        data: newCart,
      }
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation Error`,
        data: error.message,
      }
    }
  }

  async addProduct(idCart, idProduct, quantity = 1) {
    try {
      const cart = await CartModel.findById(idCart)
      // console.log(cart)
      if (!cart) {
        return {
          code: 404,
          status: false,
          message: `Cart with id ${idCart} Not Found`,
          data: [],
        }
      }
      //   console.log(cart.data.product)
      const existsProduct = cart.products.find(
        (prod) => prod.product._id.toString() === idProduct
      )

      if (existsProduct) {
        existsProduct.quantity += quantity
      } else {
        cart.products.push({ product: idProduct, quantity })
      }

      //Cuuando modifican tiene que marcarlo con "markModified"
      //Marcamos la propiedad "products" como modificada:
      cart.markModified('products')

      await cart.save()
      return {
        code: 201,
        status: true,
        message: `Product successfully added with id: ${idProduct} to the Cart with id ${idCart}`,
        data: cart,
      }
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation Error`,
        data: error.message,
      }
    }
  }

  async getCartById(idCart) {
    try {
      const foundCart = await CartModel.findById(idCart)

      if (!foundCart) {
        return {
          code: 404,
          status: false,
          message: `Cart with id ${idCart} does'nt exist`,
          data: [],
        }
      }
      return {
        code: 200,
        status: true,
        message: `Cart found with id ${idCart}`,
        data: foundCart,
      }
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation Error`,
        data: error.message,
      }
    }
  }

  async deleteProductCart(idCart, idProduct) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        idCart,
        {
          $pull: { products: { product: idProduct } },
        },
        { new: true }
      )
      if (!cart) {
        return {
          code: 404,
          status: false,
          message: `Cart with id ${idCart} does'nt exist`,
          data: [],
        }
      }
      return {
        code: 200,
        status: true,
        message: `Success`,
        data: cart,
      }
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation Error`,
        data: error.message,
      }
    }
  }
}

export default CartManager
