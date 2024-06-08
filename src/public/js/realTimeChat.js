const socketClient = io()
const nombreUsuario = document.getElementById('nombreusuario')
const formulario = document.getElementById('formulario')
const inputmensaje = document.getElementById('mensaje')
const chat = document.getElementById('chat')

// let usuario = null

// if (!usuario) {
//   Swal.fire({
//     title: 'Welcome to my Customer Chat Service',
//     text: 'Ingresa tu usuario',
//     input: 'text',
//     inputValidator: (value) => {
//       if (!value) {
//         return 'Necesitas ingresar tu Usuario'
//       }
//     },
//   }).then((username) => {
//     usuario = username.value
//     nombreUsuario.innerHTML = usuario
//     socketClient.emit('nuevousuario', usuario)
//   })
// }

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
    localStorage.setItem('username', user) // Guardar el nombre de usuario en localStorage
    nombreUsuario.innerHTML = user
    socketClient.emit('login', user)
    setTimeout(() => {
      localStorage.removeItem('username')
    }, timeRemoveInMinuts * 60 * 1000)
  })
} else {
  nombreUsuario.innerHTML = user
  socketClient.emit('login', user)
  setTimeout(() => {
    localStorage.removeItem('username')
  }, timeRemoveInMinuts * 60 * 1000)
}

function scrollToBottom() {
  const chatContainer = document.getElementById('chat-messages')
  chatContainer.scrollTop = chatContainer.scrollHeight
}

formulario.onsubmit = (e) => {
  e.preventDefault()
  const info = {
    user: user,
    message: inputmensaje.value,
  }
  console.log(info)
  socketClient.emit('mensaje', info)
  inputmensaje.value = ' '
  scrollToBottom()
}

socketClient.on('chat', (mensajes) => {
  const chatRender = mensajes
    .map((mensaje) => {
      const fechaCreacion = new Date(mensaje.createdAt)
      const opcionesHora = { hour: '2-digit', minute: '2-digit' }
      const horaFormateada = fechaCreacion.toLocaleTimeString(
        undefined,
        opcionesHora
      )
      return `<p class="message-container"><strong>${horaFormateada}</strong> - <strong>${mensaje.user}</strong>: ${mensaje.message}</p>`
    })
    .join('')
  chat.innerHTML = chatRender
})

// Manejo del clic en el botón "Vaciar Chat"
document.getElementById('clearChat').addEventListener('click', () => {
  // Borrar el contenido del chat en el cliente
  document.getElementById('chat').textContent = ''

  // Emitir el evento "clearchat" al servidor usando socketClient
  socketClient.emit('clearchat')
})

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
