const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const sessionChecker = require('../utils/sessionChecker')
const tokenExtractor = require('../utils/tokenExtractor')

router.get('/', async (req, res, next) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: {
          [Op.substring]: req.query.search
          }
        }, {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })

  blogs.map((b) => {
    console.log(`${b.author}: '${b.title}', ${b.likes} likes`)
  })

  res.json(blogs)
})

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    console.log(JSON.stringify(blog, null, 2))
    if (blog) {
      res.json(blog)
    }
    return res.status(404).end()
  } catch (error) {
    next(error)
  }
})

router.post('/', tokenExtractor, sessionChecker, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, sessionChecker, async (req, res, next) => {
  try {
    const blogToDelete = await Blog.findByPk(req.params.id)
    const user = await User.findOne({
      where: { username: req.decodedToken.username }
    })
    if (user.id === blogToDelete.userId) {
      await Blog.destroy({ where: { id: req.params.id } })
      res.status(200).end()
    } else {
      return response.status(401).json({ error: 'Not your blog' })
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blogToChange = await Blog.findByPk(req.params.id)
    blogToChange.likes += 1
    await blogToChange.save()
    res.json(blogToChange)
  } catch (error) {
    next(error)
  }
})

module.exports = router