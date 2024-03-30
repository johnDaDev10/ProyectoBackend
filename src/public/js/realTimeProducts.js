const socketClient = io()

const frmProduct = document.getElementById('frmProducts')
const title = document.getElementById('title')
const description = document.getElementById('description')
const code = document.getElementById('code')
const thumbnail = document.getElementById('thumbnail')
const price = document.getElementById('price')
const stock = document.getElementById('stock')
const category = document.getElementById('category')
const allProductsTable = document.getElementById('allProductsTable')
const getId = document.getElementById('getId')
const product = document.getElementById('product')
const frmColProduct = document.getElementById('frmColProduct')

frmProduct.onsubmit = (e) => {
  const newProduct = {
    title: title.value,
    description: description.value,
    code: code.value,
    thumbnail: thumbnail.value,
    price: +price.value,
    stock: +stock.value,
    category: category.value,
  }
  socketClient.emit('postProduct', newProduct)
  e.preventDefault()
  // document.getElementById('frmProducts').reset()
}

socketClient.on('postProductTable', async (prod) => {
  const newRow = `
        <tr id="product">
        <!--Columna-->
                <td>${prod.id}</td>
                <td>${prod.title}</td>
                <td>${prod.description}</td>
                <td>$ ${prod.price}</td>
                <td>${prod.thumbnail || 'thumbnail not found'}</td>
                <td>${prod.code}</td>
                <td>${prod.stock}</td>                        
                <td>${prod.category}</td>   
                <td><button id="delete">DELETE</button></td>
        </tr>
        `

  allProductsTable.innerHTML += newRow
})

document.getElementById('allProductsTable').onclick = (e) => {
  console.log('BOTON ESTRIPADO')
  const target = e.target
  const parentElement = target.parentElement.parentElement
  // console.log(parentElement);
  // console.log(target);
  // console.log(parentElement.children[0].innerHTML);
  // console.log(target.id === "delete");
  if (target.id === 'delete') {
    target.parentElement.parentElement.remove()
    e.preventDefault()
    socketClient.emit('deleteProduct', parentElement.children[0].innerHTML)
  }
}

socketClient.on('newArrProducts', async (products) => {
  const newRow = products
    .map((prod) => {
      return `
        <tr id="product">
        <!--Columna-->
                <td>${prod.id}</td>
                <td>${prod.title}</td>
                <td>${prod.description}</td>
                <td>$ ${prod.price}</td>
                <td>${prod.thumbnail || 'thumbnail not found'}</td>
                <td>${prod.code}</td>
                <td>${prod.stock}</td>                        
                <td>${prod.category}</td>   
                <td><button id="delete">DELETE</button></td>
        </tr>
        `
    })
    .join(' ')

  allProductsTable.innerHTML = newRow
})
