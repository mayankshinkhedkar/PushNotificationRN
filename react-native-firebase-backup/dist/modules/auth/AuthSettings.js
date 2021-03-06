import { getNativeModule } from '../../utils/native';
import { isAndroid, isIOS } from '../../utils';

/**
 * Interface representing an Auth instance's settings, currently used
 * for enabling/disabling app verification for phone Auth testing. *
 */
export default class AuthSettings {
  constructor(auth) {
    this._auth = auth;
    this._appVerificationDisabledForTesting = false;
  }
  /**
   * Flag to determine whether app verification should be disabled for testing or not.
   *
   * @platform iOS
   * @return {boolean}
   */


  get appVerificationDisabledForTesting() {
    return this._appVerificationDisabledForTesting;
  }
  /**
   * Flag to determine whether app verification should be disabled for testing or not.
   *
   * @platform iOS
   * @param disabled
   */


  set appVerificationDisabledForTesting(disabled) {
    if (isIOS) {
      this._appVerificationDisabledForTesting = disabled;
      getNativeModule(this._auth).setAppVerificationDisabledForTesting(disabled);
    }
  }
  /**
   * The phone number and SMS code here must have been configured in the
   * Firebase Console (Authentication > Sign In Method > Phone).
   *
   * Calling this method a second time will overwrite the previously passed parameters.
   * Only one number can be configured at a given time.
   *
   * @platform Android
   * @param phoneNumber
   * @param smsCode
   * @return {*}
   */


  setAutoRetrievedSmsCodeForPhoneNumber(phoneNumber, smsCode) {
    if (isAndroid) {
      return getNativeModule(this._auth).setAutoRetrievedSmsCodeForPhoneNumber(phoneNumber, smsCode);
    }

    return Promise.resolve(null);
  }

}