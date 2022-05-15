const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId']}
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)

    const user = await User.create({ ...req.body, passwordHash })
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    console.log('USERNAME', req.params.username.substring(1))
    const user = await User.findOne({
      where: {
        username: req.params.username.substring(1)
      }
    })
    user.username = req.body.newUsername
    user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router