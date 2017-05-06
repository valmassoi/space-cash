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
  View
} from 'react-native'

export default class SpaceCash extends Component {

  constructor(props) {
    super(props)
    this.state = {
      exchange: 'bitstamp',
      price: null,
    }
  }

  componentDidMount() {
    this.getPriceFromApi('')
  }

  setExchange(exchange) {
    this.setState({ exchange })
    let symbol = ''
    switch (exchange) {
      case 'coinmarketcap':
        symbol = 'bitcoin'
        break;
      case 'shapeshift':
        symbol = 'btc_ltc'
        break;
      default:

    }
    getPriceFromApi(symbol)
  }

  getPriceFromApi(symbol) {
    const { exchange } = this.state
    const url = `http://localhost:8080/api/ticker/${exchange}/${symbol}`
    return fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({ price: responseJson.price })
     })
     .catch((error) => {
       console.error(error)
     })
 }

  render() {
    const { price } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          ${price}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

AppRegistry.registerComponent('SpaceCash', () => SpaceCash)
