import express from 'express'
import apiRoutes from './routes/app.routes.js'

const PORT = 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`Listening on PORT => ${PORT}`)
})
