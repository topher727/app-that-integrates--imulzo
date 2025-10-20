
# myID Voicemail App - Build Instructions

## Overview
This is a React Native + Expo 54 app for managing voicemail with webhook integration, contacts access, and call history.

## Features
- Voicemail management interface
- Webhook URL configuration
- Contacts integration with permissions
- Call history display (simulated)
- Native look and feel for iOS and Android
- Dark mode support

## Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- EAS CLI installed globally: `npm install -g eas-cli`
- Android Studio (for Android builds) or Xcode (for iOS builds)

## Development

### Run on Android Device/Emulator
```bash
npm run android
```

### Run on iOS Device/Simulator
```bash
npm run ios
```

### Run on Web
```bash
npm run web
```

## Building APK for Android

### Method 1: Using EAS Build (Recommended)

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure the project**:
   ```bash
   eas build:configure
   ```

4. **Build APK for Android**:
   ```bash
   eas build -p android --profile preview
   ```
   
   Or for production:
   ```bash
   eas build -p android --profile production
   ```

5. **Download the APK**:
   - Once the build completes, you'll receive a download link
   - Download the APK and install it on your Android device

### Method 2: Local Build

1. **Prebuild the native Android project**:
   ```bash
   npm run build:android
   ```
   or
   ```bash
   npx expo prebuild -p android
   ```

2. **Navigate to the android folder**:
   ```bash
   cd android
   ```

3. **Build the APK**:
   ```bash
   ./gradlew assembleRelease
   ```

4. **Find your APK**:
   The APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## App Configuration

### Permissions
The app requests the following permissions on Android:
- READ_CONTACTS - To display contact information
- WRITE_CONTACTS - To manage contacts
- READ_CALL_LOG - To display call history
- WRITE_CALL_LOG - To manage call logs
- RECORD_AUDIO - For voicemail recording
- READ_PHONE_STATE - To detect phone state

### Bundle Identifier
- Android: `com.myid.voicemail`
- iOS: `com.myid.voicemail`

## Testing the App

1. **Install the APK** on your Android device
2. **Grant permissions** when prompted
3. **Test features**:
   - Navigate through tabs (Home, Contacts, Profile, Settings)
   - Configure webhook URL in Settings
   - Grant contacts permission to view contacts
   - Test voicemail interface

## Troubleshooting

### Build Fails
- Clear cache: `npx expo start -c`
- Remove node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `npx expo prebuild --clean`

### Permissions Not Working
- Ensure permissions are declared in app.json
- Check Android manifest after prebuild
- Manually grant permissions in device settings

### App Crashes on Startup
- Check logs: `npx expo start` and view console
- Verify all dependencies are installed
- Ensure native modules are properly linked

## Production Checklist

Before releasing to production:
- [ ] Update version in app.json
- [ ] Update versionCode (Android) and buildNumber (iOS)
- [ ] Test on multiple devices
- [ ] Verify all permissions work correctly
- [ ] Test webhook integration
- [ ] Enable ProGuard for Android (optional)
- [ ] Generate signed APK/AAB for Play Store
- [ ] Test dark mode thoroughly
- [ ] Verify performance on low-end devices

## Native Features

### Current Implementation
- Mock voicemail data (UI ready for native integration)
- Contacts access via expo-contacts
- Simulated call history (native module needed for real data)
- Webhook configuration storage

### Future Native Integration
To connect to real voicemail and call log data, you'll need to:
1. Create native modules for Android/iOS
2. Implement voicemail access APIs
3. Connect to carrier voicemail services
4. Implement real-time webhook notifications

## Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev
- Review React Native docs: https://reactnative.dev
- Check EAS Build docs: https://docs.expo.dev/build/introduction/
