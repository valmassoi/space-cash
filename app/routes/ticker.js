'use strict'

const tickerRouter = require('express').Router()
const axios = require('axios')
const _ = require('lodash')
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
    case 'winkdex':
      return data.price / 100
      break
    default:
      return result
  }
}

function getFromThirdPary(apiSource, symbol, res) {
  const redisKey = apiSource + symbol
  console.log('key', redisKey);
  redisClient.get(redisKey, (err, data) => {
    if (err) throw err
    if (data != null) {
      console.log('stored in redis');
      res.end(JSON.stringify({ price: data }))
    } else {
      console.log('get from 3rd party')
      const apiUrl = thirdPartyApis[apiSource] &&
        thirdPartyApis[apiSource].ticker + symbol + (apiSource === 'coinbase' ? '/spot' : '')
      if (!apiUrl) {
        res.status(400).send({ error: 'Bad Request. Invalid Exchange.' })
      } else {
        axios.get(apiUrl)
          .then((result) => {
            return decodeTickerResponse(apiSource, result.data)
          })
          .then((price) => {
            if (!price) { throw new Error('Bad Symbol.') }
            redisClient.setex(redisKey, REDIS_EXPIRE, price)
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(JSON.stringify({ price, timestamp: new Date() }))
          })
          .catch((err) => {
            console.error(err)
            res.status(400).send({ error: err.message })
          })
      }
    }
  })
}

// get currency names: https://poloniex.com/public?command=returnCurrencies

tickerRouter.get('/poloniex/:pair?', (req, res) => {
  const { pair } = req.params
  const url = 'https://poloniex.com/public?command=returnTicker'
  axios.get(url)
    .then((result) => {
      const data = result.data[pair] || result.data
      res.end(JSON.stringify({ data }))
    })
    .catch((err) => {
      console.error(err)
      res.status(400).send({ error: err.message })
    })
})

tickerRouter.get('/:exchange/:symbol?', (req, res) => {
  const { exchange, symbol } = req.params
  getFromThirdPary(exchange, symbol || '', res)
})

module.exports = tickerRouter
