import { ProductModel } from '../../models/product.model.js'

class ProductManager {
  /* 
        getProducts
    - Debe devolver el arreglo con todos los productos creados hasta ese momento
  */
  async getProducts() {
    try {
      const products = await ProductModel.find()
      return {
        code: 200,
        status: true,
        message: `All products found`,
        data: products,
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

  async limitProducts(limit) {
    try {
      const products = await this.getProducts()
      if (+limit > products.data.length || +limit <= 0 || isNaN(limit)) {
        return {
          code: 400,
          status: false,
          message:
            +limit > products.data.length || +limit === 0
              ? `Not enough products found`
              : `'${limit}' --> Invalid Data`,
          data: [],
        }
      }

      const limitProducts = products.data.slice(0, limit)
      return {
        code: 200,
        status: true,
        message: `These are the ${limit} products found`,
        data: limitProducts,
      }
    } catch (error) {
      console.log(`Catch Error from getProducts ${error}`)
    }
  }

  /* 
        addProduct()
    - Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    - Al agregarlo, debe crearse con un id autoincrementable
  */
  async addProduct(product) {
    // const attributes = [
    //   'title',
    //   'description',
    //   'price',
    //   'code',
    //   'stock',
    //   'category',
    //   'status',
    //   'thumbnail',
    // ]

    // product.status = typeof product.status === 'boolean' ? product.status : true
    // product.thumbnail = product.thumbnail ?? 'no image'
    // const missingAttributes = attributes.filter(
    //   (attribute) => !(attribute in product)
    // )
    // if (missingAttributes.length > 0) {
    //   return {
    //     code: 400,
    //     status: false,
    //     message:
    //       product.id || product._id
    //         ? 'Error, The id can`t be sent'
    //         : `Error, Bad Request, Wrong Data ( Missing ${missingAttributes} Attributes)`,
    //     data: [],
    //   }
    // }
    // const extraAttributes = Object.keys(product).filter(
    //   (attribute) => !attributes.includes(attribute)
    // )
    // if (extraAttributes.length > 0) {
    //   return {
    //     code: 400,
    //     status: false,
    //     message:
    //       product.id || product._id
    //         ? 'The id can`t be sent'
    //         : `Error, Bad Request, Wrong Data ( Extra Attributes => ${extraAttributes})`,
    //     data: [],
    //   }
    // }

    // console.log(product)

    try {
      const codeSearch = await ProductModel.findOne({ code: product.code })
      if (codeSearch) {
        return {
          code: 400,
          status: false,
          message: `Repeated 'code'`,
          data: [],
        }
      }
      const newProduct = await ProductModel.create(product)

      console.log(newProduct)
      return {
        code: 201,
        status: true,
        message: `successfully added`,
        data: newProduct,
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

  /*
    getProductById
    - Debe buscar en el arreglo el producto que coincida con el id
    - En caso de no coincidir ningún id, mostrar en consola un error “Not found”
  */

  async getProductById(idProduct) {
    try {
      const foundProduct = await ProductModel.findById(idProduct)
      return foundProduct
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation Error`,
        data: error.message,
      }
    }
  }

  async updateProduct(idProduct, newProperties) {
    // const attributes = [
    //   'title',
    //   'description',
    //   'price',
    //   'code',
    //   'stock',
    //   'category',
    //   'status',
    //   'thumbnail',
    // ]
    // const extraAttributes = Object.keys(newProperties).filter(
    //   (attribute) => !attributes.includes(attribute)
    // )

    // console.log(extraAttributes)
    // if (extraAttributes.length > 0) {
    //   console.log(
    //     newProperties.id
    //       ? 'The id can`t be sent'
    //       : `Error, Bad Request, Check The Data ( Extra Attributes => ${extraAttributes})`
    //   )
    //   return
    // }

    try {
      const updateProduct = await ProductModel.updateOne(
        { _id: idProduct },
        { ...newProperties }
      )
      return updateProduct
    } catch (error) {
      return {
        code: 400,
        status: false,
        message: `Validation Error`,
        data: error.message,
      }
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
