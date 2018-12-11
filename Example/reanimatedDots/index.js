import React from 'react';
import { Button, Dimensions, StyleSheet, View } from 'react-native';
import splineInterpolate from 'react-native-reanimated-spline-interpolate';
import Animated, { Easing } from 'react-native-reanimated';


const {
    cond,
    multiply,
    startClock,
    // eslint-disable-next-line no-unused-vars
    interpolate: linearInterpolate,
    stopClock,
    clockRunning,
    block,
    timing,
    add,
    debug,
    Value,
    divide,
    sub,
    Clock
} = Animated;




// for comparison
// eslint-disable-next-line no-unused-vars
const lagrangeInterpolate = (val, { inputRange, outputRange }) => {
    const nodes = [];
    for (let i = 0; i < inputRange.length; i++) {
        const factors = [];
        for (let j = 0; j < inputRange.length; j++) {
            if (i === j) {
                continue;
            }
            factors.push(divide(sub(val, inputRange[j]), sub(inputRange[i],inputRange[j])));
        }
        nodes.push(multiply(...factors, outputRange[i]));
    }
    return add(...nodes);
};





// Basic example
/*const POINTS = [
  [0, 10],
  [100, 60],
  [200, 110],
]*/

/*const POINTS = [
  [0, 10],
  [40, 60],
  [100, 40],
  [200, 110],
]*/

/*const POINTS = [
  [0, 10],
  [20, 10],
  [40, 60],
  [50, 40],
  [70, 40],
  [100, 110],
  [130, 40],
  [200, 80],
]*/


// animation from o to 200
const POINTS = [
  [0, 60, 70],
  [30, 10, 0],
  [40, 60, 40],
  [50, 10, 50],
  [60, 100, 60],
  [70, 100, 70],
  [100, 110, 180],
  [130, 40, 130],
  [140, 50, 140],
  [150, 60, 100],
  [160, 80, 150],
  [180, 100, 180],
  [200, 60, 70],
];


const { width, height } = Dimensions.get('window');
const DOT_SIZE = 20;
const CHART_DOT_SIZE = 20;
const ax = Math.min(width, height / 2 - 50) - DOT_SIZE;
const scale = (ax - DOT_SIZE) / 100;

function runTiming() {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };
    const clock = new Clock();
    const config = {
        duration: 5000,
        toValue: 200,
        easing: Easing.linear
    };

    return block([
        cond(clockRunning(clock),
            timing(clock, state, config)
            , [
                startClock(clock)]
        ),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}


const prepareRanges = (ps) => {
  const inputRange = [];
  const outputRangeX = [];
  const outputRangeY = [];
  for (let i in ps) {
    const p = ps[i];
    inputRange.push(p[0]);
    outputRangeX.push(p[1]);
    outputRangeY.push(p[2]);
  }
  return [inputRange, outputRangeX, outputRangeY];
}

const [inputRange, outputRangeX, outputRangeY] = prepareRanges(POINTS)


export default class Example extends React.Component {
  static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {
          startAnimation: () => {}
      };
      return {
          headerRight: <Button onPress={params.startAnimation} title="Start" />
      };
  };
  _trans;
  state = {
      running: false
  };

  constructor(props) {
      super(props);
      this.props.navigation.setParams({
          startAnimation: () => {
              this._trans = runTiming();
              this.setState({ running: !this.state.running });
          }
      });
  }

  render() {
      const points = (() => {
          const res = [];
          for (let i = 0; i< inputRange.length; i++) {
              res.push({
                  y: outputRangeY[i],
                  x: outputRangeX[i],
                  k: inputRange[i]
              });
          }
          return res;
      })();
      //const t = multiply(this._trans, scale);
      const x = multiply(splineInterpolate(this._trans, { inputRange: inputRange, outputRange: outputRangeX }), scale);
      const y = multiply(splineInterpolate(this._trans, { inputRange: inputRange, outputRange: outputRangeY }), scale);
      return (
          <View style={styles.container}>
              {points.map(c => (
                  <View
                      key={`__${c.k}`}
                      style={[
                          styles.chartdot,
                          {
                              top: scale * c.y,
                              left: scale * c.x,
                              backgroundColor: 'red'
                          }
                      ]}
                  />
              ))}
              <Animated.View
                  style={[
                      styles.box,
                      {
                          transform: [
                              { translateX: this.state.running ? x : scale * POINTS[0][1] },
                              { translateY: this.state.running ? y : scale * POINTS[0][2] }
                          ]
                      }
                  ]}
              />
          </View>
      );
  }
}

const styles = StyleSheet.create({
    chart: {
        width: ax + 10,
        height: ax + 10,
        padding: 5,
        borderWidth: 2,
        borderColor: '#06060688',
        margin: 2
    },
    chartdot: {
        position: 'absolute',
        borderRadius: CHART_DOT_SIZE / 2,
        width: CHART_DOT_SIZE,
        height: CHART_DOT_SIZE,
        backgroundColor: 'grey'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    box: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderColor: '#F5FCFF',
        backgroundColor: '#005fff88'
    }
});
