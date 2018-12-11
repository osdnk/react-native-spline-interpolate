import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import ReanimatedChartScreen from './reanimatedChart';
import AnimatedChartScreen from './animatedChart';
import ReanimatedDotsScreen from './reanimatedDots';
import AnimatedDotsScreen from './animatedDots';

const SCREENS = {
    ReanimatedDots: { screen: ReanimatedDotsScreen, title: 'Reanimated dots' },
    ReanimatedChart: { screen: ReanimatedChartScreen, title: 'Reanimated chart' },
    AnimatedDots: { screen: AnimatedDotsScreen, title: 'Animated dots' },
    AnimatedChart: { screen: AnimatedChartScreen, title: 'Animated chart' },
};

class MainScreenItem extends React.Component {
  _onPress = () => this.props.onPressItem(this.props.item);
  render() {
      const { key } = this.props.item;
      return (
          <TouchableOpacity style={styles.button} onPress={this._onPress}>
              <Text style={styles.buttonText}>{SCREENS[key].title || key}</Text>
          </TouchableOpacity>
      );
  }
}

class MainScreen extends React.Component {
  static navigationOptions = {
      title: 'Spline Interpolation Example'
  };
  render() {
      const data = Object.keys(SCREENS).map(key => ({ key }));
      return (
          <FlatList
              style={styles.list}
              data={data}
              ItemSeparatorComponent={ItemSeparator}
              renderItem={props => (
                  <MainScreenItem
                      {...props}
                      onPressItem={({ key }) => this.props.navigation.navigate(key)}
                  />
              )}
          />
      );
  }
}

const ItemSeparator = () => <View style={styles.separator} />;

const ExampleApp = createStackNavigator(
    {
        Main: { screen: MainScreen },
        ...SCREENS
    },
    {
        initialRouteName: 'Main'
    }
);

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#EFEFF4'
    },
    separator: {
        height: 1,
        backgroundColor: '#DBDBE0'
    },
    buttonText: {
        backgroundColor: 'transparent'
    },
    button: {
        flex: 1,
        height: 60,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});

export default ExampleApp;
