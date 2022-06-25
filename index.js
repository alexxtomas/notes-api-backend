require('dotenv').config()
require('./mongo.js')
require('express-async-errors')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const cors = require('cors')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes.js')
const loginRouter = require('./controllers/login.js')
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

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

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
