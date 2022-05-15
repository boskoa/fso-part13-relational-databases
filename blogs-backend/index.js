require('dotenv').config()
const express = require('express')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { errorHandler } = require('./utils/errorHandler')

const app = express()

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()