import { CartModel } from '../../models/cart.model.js'
import { ProductModel } from '../../models/product.model.js'

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

      //Cuuando modifican sin funciones directas de mongoose tiene que marcarlo con "markModified"
      //Marcamos la propiedad "products" como modificada:
      cart.markModified('products')
      cart.save()
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
      const foundCart = await CartModel.findById(idCart).lean()

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

  async updateCart(idCart, products) {
    if (!products || !Array.isArray(products)) {
      return {
        code: 400,
        status: false,
        message: `Invalid or missing products array in request body`,
        data: [],
      }
    }
    const idsProducts = products.map((prod) => prod.product)
    try {
      const existingProducts = await ProductModel.find({
        _id: { $in: idsProducts },
      })
      console.log(existingProducts.length, idsProducts.length)

      if (existingProducts.length !== idsProducts.length) {
        return {
          code: 404,
          status: false,
          message: `One or more Products don't exist`,
          data: [],
        }
      }
      const cart = await CartModel.findByIdAndUpdate(
        idCart,
        { products },
        { new: true, runValidators: true }
      )
      //  (new: true) : Indica que se debe devolver el documento actualizado en lugar del documento original.
      // (runValidators: true) : Asegura que se ejecuten las validaciones del esquema al actualizar el documento.

      if (!cart) {
        return {
          code: 404,
          status: false,
          message: `Cart with id ${idCart} Not Found`,
          data: [],
        }
      }

      return {
        code: 201,
        status: true,
        message: `Cart with id: ${idCart} successfully updated`,
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

  async updateQuantityProduct(idCart, idProduct, quantity) {
    try {
      if (!quantity || isNaN(quantity)) {
        return {
          code: 401,
          status: false,
          message: !quantity
            ? `Property quantity has not been sent`
            : `Property quantity must be an integer`,
          data: [],
        }
      }
      const updateCart = await CartModel.findOneAndUpdate(
        { _id: idCart, 'products.product': idProduct },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      )
      // 'products.$.quantity': quantity: Utiliza el operador $ para referenciar el primer elemento del array products que coincide con el filtro de búsqueda (es decir, el producto cuyo product es idProduct). Luego, actualiza el campo quantity de ese producto con el nuevo valor quantity
      //  (new: true) : Indica que se debe devolver el documento actualizado en lugar del documento original.

      if (!updateCart) {
        return {
          code: 404,
          status: false,
          message: `Cart or Product Not Found`,
          data: [],
        }
      }

      return {
        code: 201,
        status: true,
        message: ` Product quantity successfully updated`,
        data: updateCart,
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

  async deleteAllProducts(idCart) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        idCart,
        { $set: { products: [] } },
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
        message: `Cart emptied successfully`,
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
// 6635bc8a9410614df3d5c98c
// 6635bc8a9410614df3d5c98f
// 6635bc8a9410614df3d5c990
// 6635bc8a9410614df3d5c992
// 665f9bdd79ed7dcf2665da0c
