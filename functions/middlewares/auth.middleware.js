const admin = require('./../firebase')
async function authMiddleware(req, res, next) {
  const tokenBearer = req.get('Authorization')
  if (!tokenBearer) {
    return res.status(403).send('Token is not provided')
  }
  const token = tokenBearer.split(' ')[1]
  if (token) {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.userId = decodedToken.uid
    return next()
  } else {
    return res.status(403).send('Unauthorized')
  }
}

module.exports = authMiddleware
