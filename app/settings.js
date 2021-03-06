exports.REDIS_EXPIRE = 60 // seconds

exports.thirdPartyApis = {
  bitstamp: {
    ticker: 'https://www.bitstamp.net/api/ticker_hour/',
  },
  coinbase: {
    ticker: 'https://api.coinbase.com/v2/prices/', // + BTC-USD/spot
  },
  coinmarketcap: {
    ticker: 'https://api.coinmarketcap.com/v1/ticker/', // + bitcoin
  },
  shapeshift: {
    ticker: 'https://shapeshift.io/rate/', // + btc_ltc
  },
  winkdex: {
    ticker: 'https://winkdex.com/api/v0/price',
  },
}
