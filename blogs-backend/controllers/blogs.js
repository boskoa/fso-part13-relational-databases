const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (req, res, next) => {
  const blogs = await Blog.findAll()

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

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Blog.destroy({ where: { id: req.params.id } })
    res.status(200).end()
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