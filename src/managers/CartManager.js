import fs from 'fs/promises'
import { existsSync } from 'fs'

class CartManager {
  constructor(path) {
    this.path = path
  }

  async readFile() {
    return await fs.readFile(this.path, 'utf-8')
  }

  async writeFile(data) {
    const cartsToJSON = await JSON.stringify(data, null, '\t')
    await fs.writeFile(this.path, cartsToJSON, 'utf-8')
  }

  async getCarts() {
    try {
      if (existsSync(this.path)) {
        const carts = await this.readFile()
        const cartsParse = JSON.parse(carts)
        return cartsParse
      } else {
        return []
      }
    } catch (error) {
      console.log(`Catch Error desde getCarts ${error}`)
    }
  }

  async addCart() {
    try {
      const carts = await this.getCarts()
      const id = carts.length ? carts[carts.length - 1].id + 1 : 1
      const newCart = {
        id: id,
        products: [],
      }
      carts.push(newCart)
      await this.writeFile(carts)
      return newCart
    } catch (error) {
      console.log(`Catch Error desde addCart ${error}`)
    }
  }

  async addProduct(idCart, idProduct) {
    try {
      const carts = await this.getCarts()
      const cart = await this.getCartById(idCart)
      const productIndex = cart.products.findIndex(
        (prod) => prod.product === idProduct
      )
      if (productIndex === -1) {
        cart.products.push({
          product: idProduct,
          quantity: 1,
        })
      } else {
        cart.products[productIndex].quantity++
      }
      const cartIndex = carts.findIndex((item) => item.id === cart.id)
      carts[cartIndex] = cart
      await this.writeFile(carts)

      return cart
    } catch (error) {
      console.log(`Catch Error desde addProductCart ${error}`)
    }
  }

  async getCartById(idCart) {
    try {
      const carts = await this.getCarts()
      const foundCart = carts.find((element) => element.id === idCart)
      if (!foundCart) {
        console.log(
          `Error desde getCartById, cart no encontrado por el id ${idCart}`
        )
      }
      return foundCart
    } catch (error) {
      console.log(`Catch Error desde getCartById ${error}`)
    }
  }
}

export default CartManager
