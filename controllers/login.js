const jwt = require('jsonwebtoken')
const bycrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  const { body } = req

  const { username, password } = body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bycrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({ error: 'invalid user or password' })
  }
  // Para crear el token con jsonwebtoken
  const userForToken = {
    id: user._id,
    username: user.username
  }
  // Frimamos el token, con la palabra secreta para que se encripte el token
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {
      // Esto hara que el token expire en 7 dias osea el usuario tendra que volver a iniciar session en 7 dias
      expiresIn: 60 * 60 * 24 * 7
    })

  res.send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = loginRouter
