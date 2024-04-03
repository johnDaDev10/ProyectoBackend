const socketClient = io()

socketClient.on('sendProducts', (productsList) => {
  updateProductList(productsList)
})

function updateProductList(products) {
  const productsHdbs = document.getElementById('productList')
  // console.log(productsHdbs)
  let productsToList = ''

  products.forEach((product) => {
    productsToList += `
    <tr>
                                                
    <td><i class="bi bi-info-circle"></i> ${product.id}</td>
    <td><i class="bi bi-braces"></i> ${product.title}</td>
    <td><i class="bi bi-file-text"></i> ${product.description}</td>
    <td><i class="bi bi-tag"></i> ${product.code}</td>
    <td><i class="bi bi-currency-dollar"></i> ${product.price}</td>
    <td><i class="bi bi-check-circle"></i> ${product.status}</td>
    <td><i class="bi bi-box"></i> ${product.stock}</td>
    <td><i class="bi bi-grid"></i> ${product.category}</td>
    <td><i class="bi bi-image"></i> ${product.thumbnail}</td>
    <td><button class="btn btn-danger" type="button" id="btnDelete" onclick='deleteProduct(${product.id})'><i class="bi bi-trash"></button></i></td>

    </tr>
    `
  })
  productsHdbs.innerHTML = productsToList
}

const getForm = document.getElementById('formProduct')

getForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const newProduct = {
    title: getForm.elements.title.value,
    description: getForm.elements.description.value,
    stock: getForm.elements.stock.value,
    thumbnail: getForm.elements.thumbnail.value,
    category: getForm.elements.category.value,
    price: getForm.elements.price.value,
    code: getForm.elements.code.value,
    status: getForm.elements.status.checked,
  }

  socketClient.emit('addProduct', newProduct)

  getForm.reset()
})

document.getElementById('btnDelete').addEventListener('click', () => {
  const productIdHdbs = document.getElementById('productId')
  socketClient.emit('deleteProduct', +productIdHdbs.value)
  // console.log(productIdHdbs, +productIdHdbs.value)
  productIdHdbs.value = ''
})

function deleteProduct(pid) {
  socketClient.emit('deleteProduct', pid)
}
