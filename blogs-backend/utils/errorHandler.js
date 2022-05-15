const errorHandler = (error, req, res, next) => {
  console.log('Error: ', error.message, error.name)

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'Not found'})
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler }