import React, { Component } from 'react';
import {
  Text,
  View,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { base64ToHex16arrStr, getxyzpr } from './lib/bletools'
import CircleBle from './CircleBle'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class ItemBle extends Component {
  constructor() {
    super()

    this.state = {
      scanning: false,
      peripheral: null,
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
  }

  componentDidMount() {
    BleManager.start({ showAlert: false });

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);

    this.intervalId = setInterval(() => {
      //this.setState({ peripherals: new Map(), scanning: true });
      BleManager.scan(this.props.route.item.advertising.kCBAdvDataServiceUUIDs, 3, true).then((results) => {
        console.log('Scanning...');
        // this.setState({ scanning: true });
      });
    }, 1000);
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    clearInterval(this.intervalId)
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  handleDiscoverPeripheral(peripheral) {
    // console.log('handleDiscoverPeripheral', peripheral)
    if (peripheral && peripheral.id === this.props.route.item.id) {
      this.setState({
        peripheral: peripheral
      })
    }
  }

  render() {
    let data = [0, 0, 1, 0, 0]
    if (this.state.peripheral != null) {
      const peripheral = this.state.peripheral
      const suuid = this.props.route.item.advertising.kCBAdvDataServiceUUIDs[0]
      base64data = peripheral.advertising.kCBAdvDataServiceData[suuid].data
      let hex16 = base64ToHex16arrStr(base64data)
      data = getxyzpr(hex16)
    }
    return (
      <CircleBle data={data} />
    )
  }
}
