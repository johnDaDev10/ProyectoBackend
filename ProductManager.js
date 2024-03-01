class ProductManager {
  static idCounter = 0
  constructor() {
    this.products = []
  }
  /* 
        addProduct()
    - Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    - Al agregarlo, debe crearse con un id autoincrementable
  */
  addProduct(title, description, price, thumbnail, code, stock) {
    if (!(title && description && price && thumbnail && code && stock)) {
      console.error('Incomplete data')
      return
    }

    if (this.products.some((product) => product.code === code)) {
      console.warn('Repeated "code"')
      return
    }

    if (!this.products.length) {
      ProductManager.idCounter = 1
    } else {
      ProductManager.idCounter = this.products[this.products.length - 1].id + 1
    }

    const newProduct = {
      id: ProductManager.idCounter,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    }
    this.products.push(newProduct)
  }

  /* 
        getProducts
    - Debe devolver el arreglo con todos los productos creados hasta ese momento
  */
  getProducts() {
    return this.products
  }

  /*
    getProductById
    - Debe buscar en el arreglo el producto que coincida con el id
    - En caso de no coincidir ningún id, mostrar en consola un error “Not found”
  */
  getProductById(idProduct) {
    const foundId = this.products.find((product) => product.id === idProduct)
    if (!foundId) {
      console.error('Not found')
      return
    }
    return foundId
  }
}

// Testing:

const productManager = new ProductManager()

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(productManager.getProducts())

// Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25

productManager.addProduct(
  'producto prueba',
  'Este es un producto prueba',
  200,
  'Sin imagen',
  'abc123',
  25
)

productManager.addProduct(
  'producto prueba 2',
  'Este es el segundo producto prueba',
  300,
  'Sin imagen',
  'cba123',
  50
)

//Incompleted data
productManager.addProduct(
  'producto prueba 3',
  'Este es el tercer producto prueba',
  400,
  'Sin imagen',
  'cba1234'
)

//Se llamará al método “addProduct” con un codigo ya existente, debe arrojar un error porque el código estará repetido.
//Repeated "code"
productManager.addProduct('AA', 'BB', 200, 'CC', 'abc123', 1)

// DATA
console.log(productManager.getProducts())

//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
//Not Found
productManager.getProductById(23)

//id exists
productManager.getProductById(1)
