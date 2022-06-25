// El .Router es una clase que nos permite creaer un router de manera separada a lo que tenemos en el index.js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 })

  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id).populate('notes', { content: 1, date: 1 })
  res.json(user)
})

usersRouter.post('/', async (req, res) => {
  try {
    const { body } = req
    const { username, name, password } = body

    // Salt Rounds indica el coste de computación que va a tener el encryptar la contraseña cuanto mas alto sea mas seguro sera
    // pero mas va a tardar en hacerlo
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json(error.errors.username.message)
  }
})

module.exports = usersRouter
