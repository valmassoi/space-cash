'use strict'

import * as express from 'express'
import * as logger from 'morgan'

const app = express()

const redis = require('redis')
const REDIS_PORT = process.env.REDIS_PORT
exports.redisClient = redis.createClient(REDIS_PORT || 6379)

app.use(logger('tiny'))

const tickerRoute = require('./app/routes/ticker')
app.use('/api/ticker', tickerRoute)

app.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('404!')
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server Running on port: ${port}`)
})

module.exports = app
