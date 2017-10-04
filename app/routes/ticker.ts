'use strict'

import { Router } from 'express'
const tickerRouter: Router = Router()
import axios from 'axios'
import * as _ from 'lodash'
import { redisClient } from '../../server'
import { thirdPartyApis, REDIS_EXPIRE } from '../settings'

function decodeTickerResponse(apiSource: string, data: any) {
  switch (apiSource) {
    case 'bitstamp':
      return data.last // TODO mv to settings?
    case 'coinbase':
      return data.data.amount
    case 'coinmarketcap':
      return data[0].price_usd
    case 'shapeshift':
      return data.rate
    case 'winkdex':
      return data.price / 100
    default:
      return data
  }
}

function getFromThirdPary(apiSource: string, symbol: string, res: any) {
  const redisKey = apiSource + symbol
  console.log('key', redisKey);
  redisClient.get(redisKey, (err: any, data: any) => {
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
        .then((result: any) => {
          return decodeTickerResponse(apiSource, result.data)
        })
        .then((price: any) => {
          if (!price) { throw new Error('Bad Symbol.') }
          redisClient.setex(redisKey, REDIS_EXPIRE, price)
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end(JSON.stringify({ price, timestamp: new Date() }))
        })
        .catch((err: any) => {
          console.error(err)
          res.status(400).send({ error: err.message })
        })
      }
    }
  })
}

tickerRouter.get('/:exchange?/:symbol?', (req, res) => {
  const { exchange, symbol } = req.params
  if(!exchange) {
    _.forEach(thirdPartyApis, (url, exchange) => {
      // getFromThirdPary(exchange, symbol || '', res)
    })
  } else {
    getFromThirdPary(exchange, symbol || '', res)
  }
})

module.exports = tickerRouter
