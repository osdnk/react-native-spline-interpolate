import React from 'react';
import { Dimensions, StyleSheet, Animated, View, Button } from 'react-native';
import splineInterpolate from 'react-native-animated-spline-interpolate';


// Basic example
/*const POINTS = [
  [0, 10],
  [100, 60],
  [200, 110],
]*/

const POINTS = [
    [0, 10],
    [40, 60],
    [100, 40],
    [200, 110],
];

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

/*
const POINTS = [
  [0, 10],
  [40, 60],
  [50, 10],
  [60, 100],
  [70, 100],
  [200, 110],
]
*/

const { width, height } = Dimensions.get('window');
const DOT_SIZE = 20;
const CHART_DOT_SIZE = 20;
const ax = Math.min(width, height / 2 - 50) - DOT_SIZE;
const scale = (ax - DOT_SIZE) / 100;

const [inputRange, outputRange] = (() => {
    const inputRange = [];
    const outputRange = [];
    for (let i in POINTS) {
        const p = POINTS[i];
        inputRange.push(p[0]);
        outputRange.push(p[1]);
    }
    return [inputRange, outputRange];
})();

export default class Example extends React.Component {
  static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {
          startAnimation: () => {}
      };
      return {
          headerRight: <Button onPress={params.startAnimation} title="Start" />
      };
  };
  _trans = new Animated.Value(0);
  state = {
      running: false
  };

  constructor(props) {
      super(props);
      this.props.navigation.setParams({
          startAnimation: () => {
              Animated.timing(
                  this._trans,
                  {
                      duration: 5000,
                      toValue: inputRange[inputRange.length-1],
                      useNativeDriver: true
                  },
              ).start();
              this.setState({ running: !this.state.running });
          }
      });
  }

  render() {
      const points = (() => {
          const res = [];
          for (let i = 0; i< inputRange.length; i++) {
              res.push({
                  y: inputRange[i],
                  x: outputRange[i]
              });
          }
          return res;
      })();
      const t = Animated.multiply(this._trans, scale);
      const x = Animated.multiply(splineInterpolate(this._trans, { inputRange, outputRange }), scale);
      return (
          <View style={styles.container}>
              {points.map(c => (
                  <View
                      key={`__${c.y}`}
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
                              { translateY: this.state.running ? t : scale * POINTS[0][0] }
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
