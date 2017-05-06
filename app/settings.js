exports.REDIS_EXPIRE = 60 // seconds

exports.thirdPartyApis = {
  bitstamp: {
    ticker: 'https://www.bitstamp.net/api/ticker_hour/',
  },
  coinbase: {

  },
  coinmarketcap: {
    ticker: 'https://api.coinmarketcap.com/v1/ticker/', // + symbol
  },
  shapeshift: {
    ticker: 'https://shapeshift.io/rate/', // + symbol
  }
}
