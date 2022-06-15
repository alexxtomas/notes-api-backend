const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conectarse a nuestra base de datos MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => console.error(err))
