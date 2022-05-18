const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')
const ReadingList = require('../models/readingList')
const { Op } = require('sequelize')
const Session = require('../models/session')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId']}
      },
      {
        model: Blog,
        as: 'marked_blogs',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        }
      }
    ]
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
  let read = {
    [Op.in]: [true,false]
  }

  if (req.query.read) {
    read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username', 'disabled'],
    include: {
      model: Blog,
      as: 'marked_blogs',
      attributes: { exclude: ['userId']},
      through: {
        attributes: []
      },
      include: {
        model: ReadingList,
        attributes: { exclude: ['id', 'blogId']},
        where: {
          [Op.and]: [
            { read },
            { userId: req.params.id }
          ]
        }
      }
    }
  })
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
    if (req.body.newUsername) {
      user.username = req.body.newUsername
    }

    if (req.body.disabled !== undefined) {
      user.disabled = req.body.disabled
      await Session.destroy({ where: {userId: user.id }})
    }
    
    user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router