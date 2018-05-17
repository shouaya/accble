import React, { Component } from 'react';
import {
    Text,
    View,
    ART
} from 'react-native';
export default class CircleBle extends Component {
    render() {
        console.log(this.props)
        let [x, y, z, pitch, roll] = this.props.data
        const { Surface, Shape, Path } = ART
        const data = " x:" + x.toFixed(2) + "g     y:" + y.toFixed(2) + "g     gz:" + z.toFixed(2) + "g     p:" + pitch.toFixed(2)
        let deg = pitch
        let px = 150 + Math.cos(2 * Math.PI / 360 * deg) * 140
        let py = 150 + Math.sin(2 * Math.PI / 360 * deg) * 140
        const linex = new Path()
            .move(0, 150)
            .line(300, 0)
            .close()
        const liney = new Path()
            .move(150, 0)
            .line(0, 300)
            .close()
        const bigBall = new Path()
            .moveTo(150, 10)
            .arc(0, 280, 140)
            .arc(0, -280, 140)
            .close()
        const topBall = new Path()
            .moveTo(150, 7.5)
            .arc(0, 5, 2.5)
            .arc(0, -5, 2.5)
            .close()
        const rightBall = new Path()
            .moveTo(290, 147.5)
            .arc(0, 5, 2.5)
            .arc(0, -5, 2.5)
            .close()
        const downBall = new Path()
            .moveTo(150, 287.5)
            .arc(0, 5, 2.5)
            .arc(0, -5, 2.5)
            .close()
        const leftBall = new Path()
            .moveTo(10, 147.5)
            .arc(0, 5, 2.5)
            .arc(0, -5, 2.5)
            .close()
        const centerBall = new Path()
            .moveTo(150, 147.5)
            .arc(0, 5, 2.5)
            .arc(0, -5, 2.5)
            .close()
        const smallBall = new Path()
            .moveTo(px, py - 5)
            .arc(0, 10, 5)
            .arc(0, -10, 5)
            .close()
        return (
            <View style={{ marginTop: 80, margin: 20, padding: 20, height: 400 }}>
                <Surface width={300} height={300} style={{ backgroundColor: '#ccc' }}>
                    <Shape d={linex} stroke="#000000" strokeWidth={1} />
                    <Shape d={liney} stroke="#000000" strokeWidth={1} />
                    <Shape d={bigBall} stroke="#000000" strokeWidth={1} />
                    <Shape d={topBall} stroke="#000000" strokeWidth={1} fill="#0000ff" />
                    <Shape d={rightBall} stroke="#000000" strokeWidth={1} fill="#0000ff" />
                    <Shape d={downBall} stroke="#000000" strokeWidth={1} fill="#0000ff" />
                    <Shape d={leftBall} stroke="#000000" strokeWidth={1} fill="#0000ff" />
                    <Shape d={centerBall} stroke="#000000" strokeWidth={1} fill="#90ee90" />
                    <Shape d={smallBall} stroke="#000000" strokeWidth={1} fill="#1aad19" />
                </Surface>
                <Text style={{ marginTop: 80, textAlign: 'center' }}>{data}</Text>
            </View>
        )
    }
}
