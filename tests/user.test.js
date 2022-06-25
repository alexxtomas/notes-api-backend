const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')
const { server } = require('../index')
const { default: mongoose } = require('mongoose')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)

    const user = new User({
      username: 'alexroot',
      passwordHash
    })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'alexTomas',
      name: 'Alex',
      password: 'tw1tch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is alredy taken', async () => {
    const usersAtStart = await getUsers()
    const usernamesAtStart = usersAtStart.map(u => u.username)

    const newUser = {
      username: 'alexroot',
      name: 'Alex',
      password: 'alextest'

    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usernamesAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
