const router = require('express').Router()
const { Blog, User } = require('../models')
const tokenExtractor = require('../utils/tokenExtractor')

router.get('/', async (req, res, next) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: {
        exclude: ['id', 'username', 'passwordHash', 'createdAt', 'updatedAt']
      }
    }
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

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    console.log('DELETE', req.decodedToken, req.params.id)
    const blogToDelete = await Blog.findByPk(req.params.id)
    const user = await User.findOne({
      where: { username: req.decodedToken.username }
    })
    console.log('DELETE', JSON.stringify(user, null, 2), JSON.stringify(blogToDelete, null, 2))
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