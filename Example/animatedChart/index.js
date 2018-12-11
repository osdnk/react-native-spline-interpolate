import React from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import splineInterpolate from 'react-native-animated-spline-interpolate';
const { Value, timing, multiply } = Animated;


const { width, height } = Dimensions.get('window');
const DOT_SIZE = 20;
const CHART_DOT_SIZE = 4;
const ax = Math.min(width, height / 2 - 50) - DOT_SIZE;
const scale = (ax - DOT_SIZE) / 100;

const inputRange = [0, 20, 45, 70, 85, 100];
const outputRange = [100, 70, 60, 30, 35, 0];

export default class Example extends React.Component {
  static navigationOptions = ({ navigation }) => {
      const params = navigation.state.params || {
          startAnimation: () => {}
      };
      return {
          headerRight: <Button onPress={params.startAnimation} title="Start" />
      };
  };

  constructor(props) {
      super(props);
      this.props.navigation.setParams({
          startAnimation: () => {
              this._anim.start();
          }
      });
  }

  _transX = new Value(0);
  _anim = timing(this._transX, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: true
  });

  render() {
      const x = multiply(this._transX, scale);
      const y1 = x;
      const interpolated = splineInterpolate(this._transX, { inputRange, outputRange });
      const y2 = multiply(interpolated, scale);
      return (
          <View style={styles.container}>
              <View style={styles.chart}>
                  <Animated.View
                      style={[
                          styles.box,
                          {
                              transform: [{ translateX: x }, { translateY: y1 }]
                          }
                      ]}
                  />
              </View>
              <View style={styles.chart}>
                  <Animated.View
                      style={[
                          styles.box,
                          {
                              transform: [{ translateX: x }, { translateY: y2 }]
                          }
                      ]}
                  />
              </View>
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
        backgroundColor: '#06060633'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
