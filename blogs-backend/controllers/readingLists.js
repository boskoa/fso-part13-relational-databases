const router = require('express').Router()
const ReadingList = require('../models/readingList')
const User = require('../models/user')
const tokenExtractor = require('../utils/tokenExtractor')

router.post('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.create({ ...req.body })
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.decodedToken.username }
    })
    const listToChange = await ReadingList.findByPk(req.params.id)
    if (user.id === listToChange.userId && listToChange) {
      listToChange.read += req.body.read
      await listToChange.save()
      res.json(listToChange)
    } else {
      return res.status(401).json({ error: 'Not your reading list' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router