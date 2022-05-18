const router = require('express').Router()
const Session = require('../models/session')
const tokenExtractor = require('../utils/tokenExtractor')

router.get('/', tokenExtractor, async (req, res, next) => {
  try {
    await Session.destroy({ where: { userId: req.decodedToken.id }})
    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router