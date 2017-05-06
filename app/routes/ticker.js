'use strict'

const tickerRouter = require('express').Router()
const axios = require('axios')
const { redisClient } = require('../../server')
const { thirdPartyApis, REDIS_EXPIRE } = require('../settings')

function decodeTickerResponse(apiSource, data) {
  switch (apiSource) {
    case 'bitstamp':
      return data.last // TODO mv to settings?
      break
    case 'coinbase':
      return data.data.amount
      break
    case 'coinmarketcap':
      return data[0].price_usd
      break
    case 'shapeshift':
      return data.rate
      break
    default:
      return result
  }
}

function getFromThirdPary(apiSource, symbol, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  const redisKey = apiSource + symbol
  console.log('key', redisKey);
  redisClient.get(redisKey, (err, data) => {
    if (err) throw err
    if (data != null) {
      console.log('stored in redis');
      res.end(JSON.stringify({ price: data }))
    } else {
      console.log('get from 3rd party')
      const apiUrl = thirdPartyApis[apiSource].ticker + symbol + (apiSource === 'coinbase' ? '/spot' : '')
      axios.get(apiUrl)
        .then((result) => {
          console.log(result.data);
          const price = decodeTickerResponse(apiSource, result.data)
          console.log('price');
          redisClient.setex(redisKey, REDIS_EXPIRE, price)
          res.end(JSON.stringify({ price, timestamp: new Date() }))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  })
}

tickerRouter.get('/:exchange/:symbol', (req, res) => {
  const { exchange, symbol } = req.params
  getFromThirdPary(exchange, symbol, res)
})

module.exports = tickerRouter
