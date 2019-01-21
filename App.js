/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import firebase, { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';

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
    this._onNotificationDisplay();
    this._onNotificationOpen();
  }

  componentWillUnmount = () => {
    this.onTokenRefreshListener();
    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
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

  /**
   * Listeners of Notification
   */
  _onNotificationDisplay = () => {

    /** Triggered when a particular notification has been displayed */
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      console.log('onNotificationDisplayed', notification);
    });

    /** Triggered when a particular notification has been received */
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      console.log('onNotification', notification);
    });
  }

  /**
   * Listen for a Notification being opened
   */
  _onNotificationOpen = async () => {

    /** App in Foreground and background */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      console.log('FG action', action);
      console.log('FG notification', notification);
    });

    /** App Closed */
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      console.log('Closed action', action);
      console.log('Closed notification', notification);
    }
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
