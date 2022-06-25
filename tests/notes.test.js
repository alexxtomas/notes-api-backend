const { mongoose } = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')
// Supertest necesita que le pasemos nuestra app para eso hay que exportar la app

// No podemos sdepender de lo que haya en la db de test o deje de haber ya que en los test siempre tenemos que controlar todo
// Para eso creamos unas notas iniciales y con el hook beforeEach() creamos las notas que queremos antes de que se ejecuten los test

beforeEach(async () => {
  await Note.deleteMany({})

  // Parallel -> Las nota notas no se guardaran en el orden en el que estan en la base de datos
  // const notesObjects = initialNotes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)

  // Sequential -> Las notas se guardaran en la base de datos en el orden en el que estan
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})
describe('GET /api/notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note is about midudev', async () => {
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain('Aprendiendo FullStack JS con midudev')
  })
})

describe('POST /api/notes', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true,
      userId: '62b60d882a4111b1426de485'
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)

    expect(contents).toContain(newNote.content)
  })

  test('a note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE /api/notes/:id', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
    const { contents, response: secondResponse } = await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/123')
      .expect(400)
    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('PUT /api/notes/:id', () => {
  test('a note is modified succesfully ', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToModify = notes[0]

    const newNote = {
      content: 'This note was modified',
      important: true
    }
    await api.put(`/api/notes/${noteToModify.id}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { contents, response: secondResponse } = await getAllContentFromNotes()

    expect(contents).toContain(newNote.content)
    expect(secondResponse.body).toHaveLength(initialNotes.length)
  })
  test('a note without content or important is not modified succesfully', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToModify = notes[0]

    const newNote = {}
    await api.put(`/api/notes/${noteToModify.id}`)
      .send(newNote)
      .expect(400)
    const { contents, response: secondResponse } = await getAllContentFromNotes()

    expect(contents).not.toContain(newNote.content)
    expect(secondResponse.body).toHaveLength(initialNotes.length)
  })
})

// Es un hook que que recibe un callback que se va a ejecutar, en este caso despues de que se ejecuten todos los test
afterAll(() => {
  server.close()
  mongoose.connection.close()
})
