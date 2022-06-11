const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }
app.use(cors())
app.use(express.json())
app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en Youtube y Twitch',
    date: '08-06-22',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar las clases del FullStack Bootcamp',
    date: '28-05-22',
    important: true
  },
  {
    id: 3,
    content: 'Repasar los retos de JS de midudev',
    date: '21-03-22',
    important: true
  },
  {
    id: 4,
    content: 'Repasar ',
    date: '21-03-22',
    important: false
  }
]

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id

  const note = notes.find(note => note.id === Number(id))
  if (note === undefined) res.status(404).end()
  else res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const checkId = notes.find(note => note.id === id)
  if (checkId === undefined) res.status(404).json({ error: 'The id does not correspond to any note' }).end()
  else {
    res.json({
      deleted: notes[id - 1]
    }).status(200)
    notes = notes.filter(note => note.id !== id)
  }
})

app.post('/api/notes', (req, res) => {
  let noteToAdd = req.body
  console.log(noteToAdd)
  if (!noteToAdd.content) res.status(400).json({ error: 'note.content is missing' })
  else {
    let isImportant
    (!noteToAdd.important) ? isImportant = false : isImportant = true
    const ids = notes.map(note => note.id)
    noteToAdd = {
      id: Math.max(...ids) + 1,
      content: req.body.content,
      date: new Date().toISOString(),
      important: isImportant

    }
    noteToAdd.id = Math.max(...ids) + 1
    noteToAdd.date = new Date().toISOString()
    notes = [...notes, noteToAdd]
    res.status(201).json({ note: noteToAdd })
  }
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  if (typeof req.body.important === 'boolean') {
    notes[id].important = req.body.important
    res.json(notes[id])
  } else res.status(304).json({ error: 'The type of important is not boolean' }).end()
})

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found'
  }).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
