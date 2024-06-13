import { ProductModel } from '../../models/product.model.js'

class ProductManager {
  /* 
        getProducts
    - Debe devolver el arreglo con todos los productos creados hasta ese momento
  */
  async getProducts() {
    try {
      const products = await ProductModel.find().lean()
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

  async getProductsPaginate(limit, page, sort, query, baseUrl) {
    // console.log(limit, page, sort, query, baseUrl)
    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      lean: true,
    }

    if (sort) {
      if (sort === 'asc' || sort === 'desc') {
        options.sort = { price: sort === 'asc' ? 1 : -1 }
      }
    }

    if (query) {
      if (query.status === 'true' || query.status === 'false') {
        query.status = query === 'true'
      }
      if (query.price) {
        const isNumberPrice = +query.price
        if (!isNaN(isNumberPrice)) {
          query.price = { $gte: isNumberPrice }
        }
      }
    }

    try {
      const result = await ProductModel.paginate(query, options)

      const queryString = encodeURIComponent(JSON.stringify(query))
      // const decodedQuery = JSON.parse(decodeURIComponent(queryString))
      // console.log(decodedQuery)
      return {
        code: 200,
        status: true,
        message: `Products successfully found`,
        data: {
          count: result.totalDocs,
          limit: result.limit,
          payload: result.docs,
          totalPages: result.totalPages,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.hasPrevPage
            ? `${baseUrl}?page=${result.prevPage}&limit=${result.limit}&sort=${sort}&${queryString}`
            : null,
          nextLink: result.hasNextPage
            ? `${baseUrl}?page=${result.nextPage}&limit=${result.limit}&sort=${sort}&${queryString}`
            : null,
        },
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
      // const products = await this.getProducts()
      const documents = await ProductModel.countDocuments()
      if (+limit > documents || +limit <= 0 || isNaN(limit)) {
        return {
          code: 400,
          status: false,
          message:
            +limit > documents || +limit === 0
              ? `Not enough products found`
              : `'${limit}' --> Invalid Data`,
          data: [],
        }
      }
      const limitProducts = await ProductModel.find().limit(limit)
      // const limitProducts = products.data.slice(0, limit)
      return {
        code: 200,
        status: true,
        message: `These are the ${limit} products found`,
        data: limitProducts,
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
        addProduct()
    - Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    - Al agregarlo, debe crearse con un id autoincrementable
  */
  async addProduct(product) {
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
      if (!foundProduct) {
        return {
          code: 404,
          status: false,
          message: `Product with id ${idProduct} does'nt exist`,
          data: [],
        }
      }
      return {
        code: 200,
        status: true,
        message: `Product found with id ${idProduct}`,
        data: foundProduct,
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

  async updateProduct(idProduct, newProperties) {
    try {
      // const updateProduct = await ProductModel.updateOne(
      //   { _id: idProduct },
      //   { ...newProperties }
      // )
      const updateProduct = await ProductModel.findByIdAndUpdate(
        idProduct,
        newProperties
      )
      if (!updateProduct) {
        return {
          code: 404,
          status: false,
          message: `Error, Wrong Data, Product with id ${idProduct} does'nt exist`,
          data: [],
        }
      }
      return {
        code: 201,
        status: true,
        message: `Product successfully updated with id ${idProduct}`,
        data: (await this.getProductById(idProduct)).data,
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

  async deleteProduct(idProduct) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(idProduct)
      if (!deleteProduct) {
        return {
          code: 404,
          status: false,
          message: `Error, Wrong Data, Product with id ${idProduct} does'nt exist`,
          data: [],
        }
      }
      return {
        code: 200,
        status: true,
        message: `Product successfully deleted with id ${idProduct}`,
        data: deleteProduct,
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
  catch(error) {
    return {
      code: 400,
      status: false,
      message: `Validation Error`,
      data: error.message,
    }
  }
}

export default ProductManager
