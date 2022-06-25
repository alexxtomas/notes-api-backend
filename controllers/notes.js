const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id

  // Find notes by id in the database
  const note = await Note.findById(id).populate('user', { username: 1, name: 1 })

  if (note === null) res.status(404).end()
  if (note === undefined) res.status(404).end()
  else res.json(note)
})

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  // Remove note from database
  await Note.findByIdAndRemove(id)
  res.status(204).end()
})
notesRouter.put('/:id', userExtractor, async (req, res, next) => {
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
  const noteUpdated = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
  if (noteUpdated === null) res.status(404).json({ error: 'this note does not exist' })
  res.json(noteUpdated)
})

notesRouter.post('/', userExtractor, async (req, res, nex) => {
  const {
    content,
    important = false
  } = req.body

  // Sacar userId de request gracias al middleware userExtractor
  const { userId } = req

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  // Save Note in the database
  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })
  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.json(savedNote)
})

module.exports = notesRouter
