import firebase, { RemoteMessage } from 'react-native-firebase';

/**
 * Listen for FCM messages in the background
 */
export default async (message: RemoteMessage) => {

  /**
   * Handle background messages
   */
  console.log('RemoteMessage BG out', message);
  
  return Promise.resolve();
}