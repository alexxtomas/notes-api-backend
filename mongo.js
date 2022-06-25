const mongoose = require('mongoose')

// CON ESTO HACEMOS QUE SI ESTAMOS EN MODO TEST SE CONECTE A LA BASE DE DATOS DEDICADA A LOS TEST Y SI NO A LA DE PRODUCCION
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// Conectarse a nuestra base de datos MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => console.error(err))

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
