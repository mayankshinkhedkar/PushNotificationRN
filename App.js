/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import firebase, { RemoteMessage } from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  componentDidMount = async () => {
    
    /**
     * Monitor token generation
     */
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async fcmToken => {
      // Process your token as required
      await this._getToken();
    });
    
    await this._checkPermission();
    this._onMessageReceived();
  }

  componentWillUnmount = () => {
    this.onTokenRefreshListener();
    this.messageListener();
  }

  /**
   * Check permissions
   */
  _checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      await this._getToken();
    } else {
      this._requestPermission();
    }
  }

  /**
   * Retrieve the current registration token
   */
  _getToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log('User have FCM Token', fcmToken);
    } else {
      // user doesn't have a device token yet
      console.log('User doesn\'t have FCM Token');
    }
  }

  /**
   * Request permissions
   */
  _requestPermission = async () => {
    console.log('In request permission');
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this._getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  /**
   * Listen for FCM messages
   */
  _onMessageReceived = () => {

    /**
     * A message will trigger the onMessage listener when the application receives a message in the foreground.
     */
    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
      // Process your message as required
      console.log('RemoteMessage', message);
    });
  }

  render = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
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
});
