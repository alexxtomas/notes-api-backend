require('dotenv').config()
require('./mongo.js')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const Note = require('./models/Note.js')
const express = require('express')
const cors = require('cors')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')
const app = express()

app.use(cors())
app.use(express.json())

Sentry.init({
  dsn: 'https://7b82c09c2cb64be1b15b356bc414c1f7@o1289291.ingest.sentry.io/6507606',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// const notes = []

app.get('/api/notes', async (req, res) => {
  Note.find({}).then(notes => res.json(notes))
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  // Find notes by id in the database
  Note.findById(id).then(note => {
    if (note === undefined) res.status(404).end()
    else res.json(note)
  })
    .catch(err => {
      next(err)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  // Remove note from database
  Note.findByIdAndRemove(id).then(result => {
    res.status(204).end()
  })
    .catch(err => next(err))
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }
  // Save Note in the database
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })
  newNote.save().then(savedNote => res.json(savedNote))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  if (!note.content || !note.important) {
    res.status(400).json({
      error: 'content or important is requeried to modify note'
    })
  }

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }
  // Modify note in the database
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    })
    .catch(err => next(err))
})

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT
// El app.listen devuelve el servidor que se ha creado y lo exportamos para poder cerrarlo para pasar los test
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Exportamos la app y el sevidor para el archivo notes.test.js
module.exports = { app, server }
