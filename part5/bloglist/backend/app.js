require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


const app = express()
app.use(express.json())

mongoose
  .connect(config.MONGODB_URL, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB Atlas')
  })
  .catch(error => {
    logger.error(error.message)
  })


app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs',middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)


module.exports = app