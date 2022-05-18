const Session = require("../models/session")

const sessionChecker = async (req, res, next) => {
  try {
    const session = await Session.findOne({ where: { userId: req.decodedToken.id }})
    if (!session) {
      res.status(401).json({ error: 'No session' })
    }
  } catch (error) {
    next(error)
  }

  next()
}

module.exports = sessionChecker