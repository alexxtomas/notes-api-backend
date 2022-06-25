const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
// El formato del header con el esquema Bearer es :
  // Bearer token entonces apartir el indice 7 tenemos el token

  // Recuperar el header authorization de la request
  const authorization = req.get('authorization')

  let token = null
  // Comprobar que esta la authoricacion y que sigue el esquema Bearer
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    // Cogemos a partir del indice 7 que es donde empieza el token
    token = authorization.substring(7)
  }

  // Decodeamos el token con el token y la clave secreta
  const decodedToken = jwt.verify(token, process.env.SECRET)
  // Comprobamos que tenemos token o que el token es valido y si no mandamos error
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken

  req.userId = userId

  next()
}
