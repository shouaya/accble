import React, { Component } from 'react'

import {
  NavigatorIOS
} from 'react-native'

import ListBle from './ListBle'

export default class App extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ListBle,
          title: 'ble4lot',
        }}
        style={{flex: 1}}
      />
    );
  }
}
