const socketClient = io()
const Usuario = document.getElementById('nombreusuario')

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
                                                
    <td><i class="bi bi-info-circle"></i> ${product._id}</td>
    <td><i class="bi bi-braces"></i> ${product.title}</td>
    <td><i class="bi bi-file-text"></i> ${product.description}</td>
    <td><i class="bi bi-tag"></i> ${product.code}</td>
    <td><i class="bi bi-currency-dollar"></i> ${product.price}</td>
    <td><i class="bi bi-check-circle"></i> ${product.status}</td>
    <td><i class="bi bi-box"></i> ${product.stock}</td>
    <td><i class="bi bi-grid"></i> ${product.category}</td>
    <td><i class="bi bi-image"></i> ${product.thumbnail}</td>
    <td><button class="btn btn-danger" type="button" id="btnDelete" onclick=deleteProduct('${product._id}')><i class="bi bi-trash"></button></i></td>

    </tr>
    `
  })
  productsHdbs.innerHTML = productsToList
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

let user = localStorage.getItem('username') // Obtener el nombre de usuario de localStorage
let timeRemoveInMinuts = 2

if (!user) {
  Swal.fire({
    title: 'Identify yourself',
    input: 'text',
    text: 'Enter your username to log in to the Ecommerce',
    inputValidator: (value) => {
      return !value && 'You must type a username to continue!'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    padding: '16px',
  }).then((result) => {
    user = result.value
    localStorage.setItem('username', user)
    Usuario.innerHTML = `Welcome: ${user}`
    socketClient.emit('login', user)
    setTimeout(() => {
      localStorage.removeItem('username')
    }, timeRemoveInMinuts * 60 * 1000)
  })
} else {
  Usuario.innerHTML = `User Name: ${user}`
  socketClient.emit('login', user)
  setTimeout(() => {
    localStorage.removeItem('username')
  }, timeRemoveInMinuts * 60 * 1000)
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
  socketClient.emit('deleteProduct', productIdHdbs.value)
  // console.log(productIdHdbs, +productIdHdbs.value)
  productIdHdbs.value = ''
})

function deleteProduct(pid) {
  socketClient.emit('deleteProduct', pid)
}

socketClient.on('welcome', (user) => {
  Toast.fire({
    icon: 'success',
    title: `Welcome ${user}!`,
  })
})

socketClient.on('newUser', (user) => {
  Toast.fire({
    icon: 'info',
    title: `${user} is online!`,
  })
})
