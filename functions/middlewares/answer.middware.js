function answerMiddleware(req, res, next) {
  const guestId = req.get('guestId')
  if (!guestId) {
    return res.status(403).send("You don't have permission!")
  }
  req.guestId = guestId
  return next()
}

module.exports = answerMiddleware
