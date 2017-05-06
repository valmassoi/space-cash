'use strict'

const express = require('express')
const http = require('http')
const morgan = require('morgan')

const app = express()

const redis = require('redis')
const REDIS_PORT = process.env.REDIS_PORT
exports.redisClient = redis.createClient(REDIS_PORT || 6379)

app.use(morgan('tiny'))

const tickerRoute = require('./app/routes/ticker')
app.use('/api/ticker', tickerRoute)

app.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('404!')
})

const port = process.env.PORT || 8080
const server = http.Server(app)
server.listen(port, () => {
  console.log(`Server Running on port: ${port}`)
})
