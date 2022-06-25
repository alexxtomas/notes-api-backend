const { Schema, model } = require('mongoose')

// Crear esquema para nuestro backend de notas
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Transofrmar el objeto que nos devuelve a nuestro gusto
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Crear modelo con el esquema previamente definido

const Note = model('Note', noteSchema)

// // Encontrar los datos que hemos creado
// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

// // Crear nota con el modelo previamente creado
// const note = new Note({
//   content: 'MongoDB es increible',
//   date: new Date(),
//   important: true
// })

// // Guardar nota en el servidor
// note.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => console.error(err))

module.exports = Note
