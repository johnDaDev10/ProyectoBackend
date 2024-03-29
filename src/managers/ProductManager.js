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
    const attributes = [
      'title',
      'description',
      'price',
      'code',
      'stock',
      'category',
      'status',
      'thumbnail',
    ]

    product.status = typeof product.status === 'boolean' ? product.status : true
    product.thumbnail = product.thumbnail ?? 'no image'
    const missingAttributes = attributes.filter(
      (attribute) => !(attribute in product)
    )
    if (missingAttributes.length > 0) {
      console.log(
        product.id
          ? 'The id can`t be sent'
          : `Error, Bad Request, Check The Data ( Missing ${missingAttributes} Attributes)`
      )
      return
    }
    const extraAttributes = Object.keys(product).filter(
      (attribute) => !attributes.includes(attribute)
    )
    if (extraAttributes.length > 0) {
      console.log(
        product.id
          ? 'The id can`t be sent'
          : `Error, Bad Request, Check The Data ( Extra Attributes => ${extraAttributes})`
      )
      return
    }

    console.log(product)

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
    const attributes = [
      'title',
      'description',
      'price',
      'code',
      'stock',
      'category',
      'status',
      'thumbnail',
    ]
    const extraAttributes = Object.keys(newProperties).filter(
      (attribute) => !attributes.includes(attribute)
    )

    console.log(extraAttributes)
    if (extraAttributes.length > 0) {
      console.log(
        newProperties.id
          ? 'The id can`t be sent'
          : `Error, Bad Request, Check The Data ( Extra Attributes => ${extraAttributes})`
      )
      return
    }

    try {
      const products = await this.getProducts()
      const foundProduct = await this.getProductById(idProduct)

      if (foundProduct) {
        const codeSearch = products.some(
          (product) => product.code === newProperties.code
        )
        if (codeSearch) {
          console.log(
            `Error, the code entered already exists ( Code => ${newProperties.code})`
          )
          return
        }
        const updateProduct = { ...foundProduct, ...newProperties }

        const replaceProducts = products.map((product) => {
          return product.id === updateProduct.id ? updateProduct : product
        })
        await this.writeFile(replaceProducts)
        console.log(`Producto actualizado`)
        return updateProduct
      } else {
        console.log('No se pudo actualizar')
        return
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
        console.log(`Producto Eliminado`)
        return findProduct
      } else {
        console.log('No se pudo eliminar')
        return
      }
    } catch (error) {
      console.log(`Catch Error desde deleteProduct ${error}`)
    }
  }
}

export default ProductManager
