var autobahn = require('autobahn')
var wsuri = "wss://api.poloniex.com"
var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
})

connection.onopen = function (session) {
  // function marketEvent (args,kwargs) {
  //   console.log(args)
  // }
  function tickerEvent (args,kwargs) {
    console.log(args)
  }
  // session.subscribe('BTC_XMR', marketEvent)

  // currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, 24hrHigh, 24hrLow
  session.subscribe('ticker', tickerEvent)
}

connection.onclose = function () {
  console.log("Websocket connection closed")
}

connection.open()
