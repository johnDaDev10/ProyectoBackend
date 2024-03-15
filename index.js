import ProductManager from './managers/ProductManager.js'

//Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager('./src/data/Products.json')

// Testing:
const testing = async () => {
  try {
    // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
    console.log(await manager.getProducts())

    // Se llamará al método “addProduct” con los campos:
    // title: “producto prueba”
    // description:”Este es un producto prueba”
    // price:200,
    // thumbnail:”Sin imagen”
    // code:”abc123”,
    // stock:25

    const newProduct = {
      title: 'Producto Prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    }
    await manager.addProduct(newProduct)

    // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
    console.log(await manager.getProducts())

    // Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
    console.log(await manager.getProductById(1)) //Si existe el id 1
    console.log(await manager.getProductById(6)) //No existe el id 6 por el momento --> Undefined

    // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

    // Undefined --> no existe el id 10
    console.log(
      await manager.updateProduct(10, {
        title: 'Producto modificado',
        description: 'Este es un producto prueba modificado',
      })
    )

    console.log(
      await manager.updateProduct(2, {
        title: 'Producto modificado',
        description: 'Este es un producto prueba modificado',
      })
    )

    console.log(await manager.deleteProduct(4))
  } catch (error) {
    console.log(`Error desde el testing de index.js ${error}`)
  }
}

testing()
