/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PickerIOS
} from 'react-native'

const PickerItemIOS = PickerIOS.Item

export default class SpaceCash extends Component {

  constructor(props) {
    super(props)
    this.state = {
      exchange: 'bitstamp',
      price: null,
      loading: false,
    }
    this.setExchange = this.setExchange.bind(this)
  }

  componentDidMount() {
    const { exchange } = this.state
    this.getPriceFromApi('', exchange)
  }

  setExchange(exchange) {
    this.setState({ exchange })
    let symbol = ''
    switch (exchange) {
      case 'coinbase':
        symbol = 'BTC-USD'
        break;
      case 'coinmarketcap':
        symbol = 'bitcoin'
        break;
      case 'shapeshift':
        symbol = 'btc_ltc'
        break;
      default:
    }
    this.getPriceFromApi(symbol, exchange)
  }

  getPriceFromApi(symbol, exchange) {
    this.setState({loading: true})
    const url = `http://localhost:8080/api/ticker/${exchange}/${symbol}`
    return fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({ price: responseJson.price, loading: false })
     })
     .catch((error) => {
       console.error(error)
       this.setState({loading: false})
     })
 }

  render() {
    const { price, loading } = this.state
    const exchanges = [ // TODO mv
      'bitstamp',
      'coinbase',
      'coinmarketcap',
      'shapeshift',
      'winkdex',
    ]
    return (
      <View style={styles.container}>
        <Text style={styles.price}>
          {loading ? "loading..." : `$${price}`}
        </Text>
        <PickerIOS
          itemStyle={styles.picker}
          selectedValue={this.state.exchange}
          onValueChange={(exchange) => this.setExchange(exchange)}
        >
          {exchanges.map((exchange) => (
            <PickerItemIOS
              label={exchange} value={exchange} key={exchange}
            />
          ))}
        </PickerIOS>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#039be5',
  },
  price: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    margin: 10,
  },
  picker: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  }
})

AppRegistry.registerComponent('SpaceCash', () => SpaceCash)
