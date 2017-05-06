'use strict'

const tickerRouter = require('express').Router()
const axios = require('axios')
const { redisClient } = require('../../server')

tickerRouter.get('/:symbol', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  const { symbol } = req.params
  redisClient.get(symbol, (err, data) => {
    if (err) throw err
    if (data != null) {
      res.end(JSON.stringify(data))
    } else {
      console.log('get from 3rd party')
      const apiUrl = 'https://shapeshift.io/rate/' + symbol
      axios.get(apiUrl)
        .then((result) => {
          const { rate } = result.data
          const expire = 60 // seconds
          redisClient.setex(symbol, expire, rate)
          res.end(JSON.stringify({ rate, timestamp: new Date() }))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  })
})

module.exports = tickerRouter
