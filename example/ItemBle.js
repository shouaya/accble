import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Dimensions,
  ART
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { base64ToHex16arrStr, getxyzpr } from './lib/bletools'

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
    console.log('handleDiscoverPeripheral', peripheral)
    if (peripheral && peripheral.id === this.props.route.item.id) {
      this.setState({
        peripheral: peripheral
      })
    }
  }

  render() {
    let data = ""
    if (this.state.peripheral != null) {
      const peripheral = this.state.peripheral
      const suuid = this.props.route.item.advertising.kCBAdvDataServiceUUIDs[0]
      base64data = peripheral.advertising.kCBAdvDataServiceData[suuid].data
      let hex16 = base64ToHex16arrStr(base64data)
      let [x, y, z, pitch, roll] = getxyzpr(hex16)
      data = " x:" + x.toFixed(2) + " y:" + y.toFixed(2) + " z:" + z.toFixed(2) + " p:" + pitch.toFixed(2)
    }

    const { Surface, Shape, Path } = ART
    const path = new Path()
      .moveTo(50, 1)
      .arc(0, 99, 25)
      .arc(0, -99, 25)
      .close();
    return (
      <View style={{ marginTop: 80, margin: 20, padding: 20, backgroundColor: '#ccc' }}>
        <Text style={{ textAlign: 'center' }}>{data}</Text>
        <Surface width={100} height={100}>
          <Shape d={path} stroke="#000000" strokeWidth={1} />
        </Surface>
      </View>
    )
  }
}
