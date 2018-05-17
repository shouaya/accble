import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeEventEmitter,
    NativeModules,
    ListView,
    ScrollView,
    Dimensions
} from 'react-native';
import { base64ToHex16arrStr, getxyzpr } from './lib/bletools'
import ItemBle from './ItemBle'

import BleManager from 'react-native-ble-manager';
import Toast, { DURATION } from 'react-native-easy-toast'

const window = Dimensions.get('window');
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class ListBle extends Component {
    constructor() {
        super()

        this.state = {
            scanning: false,
            peripherals: new Map(),
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
    }

    componentDidMount() {
        BleManager.start({ showAlert: false })
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
    }

    handleStopScan() {
        console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    startScan() {
        if (!this.state.scanning) {
            this.setState({ peripherals: new Map() });
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                this.setState({ scanning: true });
            });
        }
    }

    handleDiscoverPeripheral(peripheral) {
        var peripherals = this.state.peripherals;
        if (!peripherals.has(peripheral.id)) {
            // console.log('Got ble peripheral', peripheral);
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals })
        }
    }

    viewDetail(item) {
        if (!item.advertising) {
            this.refs.toast.show('not effective beacon', DURATION.LENGTH_LONG);
            return
        }
        if (!item.advertising.kCBAdvDataServiceData) {
            this.refs.toast.show('not effective beacon', DURATION.LENGTH_LONG);
            return
        }
        if (item.advertising.kCBAdvDataServiceData.length === 0) {
            this.refs.toast.show('not effective beacon', DURATION.LENGTH_LONG);
            return
        }

        this.props.navigator.push({
            component: ItemBle,
            title: item.name,
            item: item
        });
    }

    render() {
        const list = Array.from(this.state.peripherals.values())
        const dataSource = ds.cloneWithRows(list);
        return (
            <View style={styles.container}>
                <Toast ref="toast" position='top' positionValue={200} />
                <TouchableHighlight style={{ marginTop: 80, margin: 20, padding: 20, backgroundColor: '#ccc' }} onPress={() => this.startScan()}>
                    <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
                </TouchableHighlight>
                <ScrollView style={styles.scroll}>
                    {(list.length == 0) &&
                        <View style={{ flex: 1, margin: 20 }}>
                            <Text style={{ textAlign: 'center' }}>No peripherals or Bluetooth is not enable ?</Text>
                        </View>
                    }
                    <ListView
                        enableEmptySections={true}
                        dataSource={dataSource}
                        renderRow={(item) => {
                            const color = item.connected ? 'green' : '#fff';
                            let mac = ""
                            if(item.advertising){
                                if(item.advertising.kCBAdvDataServiceUUIDs && item.advertising.kCBAdvDataServiceUUIDs.length > 0){
                                    let suuid = item.advertising.kCBAdvDataServiceUUIDs[0]
                                    if(item.advertising.kCBAdvDataServiceData && item.advertising.kCBAdvDataServiceData[suuid]){
                                        let base64data = item.advertising.kCBAdvDataServiceData[suuid].data
                                        let hex16 = base64ToHex16arrStr(base64data)
                                        //a1, 3, 64, 0, 2, 0, 2, 1, 2, 25, 6, a0, 3f, 23, ac, 
                                        //a1 03 64 00 02 00 02 01 02 25 06 a0 3f 23 ac
                                        mac = hex16.substring(18)
                                    }
                                }
                            }
                            return (
                                <TouchableHighlight onPress={() => this.viewDetail(item)}>
                                    <View style={[styles.row, { backgroundColor: color }]}>
                                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 5 }}>{item.name}</Text>
                                        <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 5 }}>UUID:{item.id}</Text>
                                        <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 5 }}>MAC:{mac}</Text>
                                    </View>
                                </TouchableHighlight>
                            );
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: window.width,
        height: window.height
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10
    },
});
