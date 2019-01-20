/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import bgMessaging from './bgMessaging';

AppRegistry.registerComponent(appName, () => App);

/** Register the background handler */
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);