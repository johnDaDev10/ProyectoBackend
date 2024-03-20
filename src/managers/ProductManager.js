import fs from 'fs/promises'
import { existsSync } from 'fs'

class ProductManager {
  static idCounter = 0
  constructor(path) {
    this.path = path
  }

  async readFile() {
    return await fs.readFile(this.path, 'utf-8')
  }

  async writeFile(data) {
    const productsToJSON = await JSON.stringify(data, null, '\t')
    await fs.writeFile(this.path, productsToJSON, 'utf-8')
  }

  /* 
        getProducts
    - Debe devolver el arreglo con todos los productos creados hasta ese momento
  */
  async getProducts() {
    try {
      if (existsSync(this.path)) {
        const products = await this.readFile()
        const productsParse = JSON.parse(products)
        return productsParse
      } else {
        return []
      }
    } catch (error) {
      console.log(`Catch Error desde getProducts ${error}`)
    }
  }

  /* 
        addProduct()
    - Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    - Al agregarlo, debe crearse con un id autoincrementable
  */
  async addProduct(product) {
    // Verificar si product.status está definido
    if (product.status === undefined) {
      // Si no está definido, establecerlo en true por defecto
      product.status = true
    }
    if (product.thumbnail === undefined) {
      // Si no está definido, establecerlo en true por defecto
      product.thumbnail = 'no image'
    }

    if (
      product.id ||
      !(
        product.title &&
        product.description &&
        product.price &&
        product.code &&
        product.stock &&
        product.category
      )
    ) {
      console.log(
        product.id
          ? 'The id can`t be sent'
          : 'Error, Bad Request, Check The Data'
      )
      return
    }
    try {
      const products = await this.getProducts()
      const codeSearch = products.some((prod) => prod.code === product.code)
      if (!codeSearch) {
        if (!products.length) {
          ProductManager.idCounter = 1
        } else {
          ProductManager.idCounter = products[products.length - 1].id + 1
        }

        const newProduct = {
          id: ProductManager.idCounter,
          ...product,
        }
        products.push(newProduct)

        await this.writeFile(products)
        console.log(`Producto agregado`)
        return newProduct
      } else {
        console.log('Repeated "code"')
        return
      }
    } catch (error) {
      console.log(`Catch Error desde addProduct ${error}`)
    }
  }

  /*
    getProductById
    - Debe buscar en el arreglo el producto que coincida con el id
    - En caso de no coincidir ningún id, mostrar en consola un error “Not found”
  */
  async getProductById(idProduct) {
    try {
      const products = await this.getProducts()
      const foundProduct = products.find((product) => product.id === idProduct)
      if (!foundProduct) {
        console.log(
          `Error desde getProductById, Producto no encontrado por el id ${idProduct}`
        )
      }
      return foundProduct
    } catch (error) {
      console.log(`Catch Error desde getProductById ${error}`)
    }
  }

  async updateProduct(idProduct, newProperties) {
    if (newProperties.id) {
      console.log(
        'Error desde updateProduct, En las nuevas propiedades se envió un ID'
      )
      return
    }
    try {
      const products = await this.getProducts()
      const foundProduct = await this.getProductById(idProduct)

      if (foundProduct) {
        const updateProduct = { ...foundProduct, ...newProperties }

        const replaceProducts = products.map((product) => {
          return product.id === updateProduct.id ? updateProduct : product
        })
        await this.writeFile(replaceProducts)
        console.log(`Producto actualizado`)
        return updateProduct
      } else {
        console.log('No se pudo actualizar')
      }
    } catch (error) {
      console.log(`Error desde updateProduct ${error}`)
    }
  }

  async deleteProduct(idProduct) {
    try {
      const products = await this.getProducts()
      const findProduct = await this.getProductById(idProduct)
      if (findProduct) {
        const findIndexProduct = products.findIndex(
          (product) => product.id === findProduct.id
        )
        products.splice(findIndexProduct, 1)
        await this.writeFile(products)
        console.log(`Producto Eliminado -->`)
        return findProduct
      } else {
        console.log('No se pudo eliminar')
      }
    } catch (error) {
      console.log(`Catch Error desde deleteProduct ${error}`)
    }
  }
}

export default ProductManager
