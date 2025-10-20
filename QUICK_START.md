
# Quick Start Guide - myID Voicemail App

## 🚀 Getting Started

This guide will help you run the app and build an APK for Android installation.

## 📱 Running the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run on Your Device

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

**For Web:**
```bash
npm run web
```

## 📦 Building APK for Android

### Option A: EAS Build (Cloud Build - Easiest)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Build APK:**
   ```bash
   eas build -p android --profile preview
   ```

4. **Wait for Build:**
   - The build will run on Expo's servers
   - You'll get a download link when complete
   - Download and install the APK on your Android device

### Option B: Local Build (Requires Android Studio)

1. **Generate Native Android Project:**
   ```bash
   npx expo prebuild -p android
   ```

2. **Build APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find Your APK:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## 🎯 Key Features

- ✅ **Voicemail Management** - View and manage voicemails
- ✅ **Webhook Integration** - Configure webhook URLs for notifications
- ✅ **Contacts Access** - View contacts with call information
- ✅ **Call History** - Track incoming, outgoing, and missed calls
- ✅ **Native Look & Feel** - Material Design for Android, iOS native tabs
- ✅ **Dark Mode** - Automatic dark mode support

## 🔐 Permissions

The app will request these permissions:
- **Contacts** - To display caller information
- **Call Log** - To show call history (simulated in current version)
- **Phone State** - To detect phone state

## 📱 Installing APK on Android

1. **Enable Unknown Sources:**
   - Go to Settings > Security
   - Enable "Install from Unknown Sources"

2. **Transfer APK:**
   - Email the APK to yourself
   - Or use USB to transfer to device
   - Or download from build link

3. **Install:**
   - Tap the APK file
   - Follow installation prompts
   - Grant requested permissions

## 🎨 App Structure

```
myID Voicemail App
├── Home Tab - Voicemail list and management
├── Contacts Tab - Contact list and call history
├── Profile Tab - User profile and app settings
└── Settings Tab - Webhook configuration
```

## 🔧 Troubleshooting

### App Won't Start
```bash
# Clear cache and restart
npx expo start -c
```

### Build Fails
```bash
# Clean and reinstall
rm -rf node_modules
npm install
```

### Permissions Not Working
- Go to device Settings > Apps > myID
- Manually grant all permissions

## 📊 Performance Tips

- The app uses native navigation on iOS for best performance
- Haptic feedback is enabled on supported devices
- Images and assets are optimized for fast loading
- Dark mode adapts to system preferences

## 🌐 Native vs Web

- **Android/iOS**: Full native experience with all features
- **Web**: Limited functionality (no contacts/call log access)

## 📝 Next Steps

1. **Test the app** on your device
2. **Configure webhook** in Settings tab
3. **Grant permissions** for contacts access
4. **Explore features** across all tabs

## 💡 Tips

- Use the search bar on Home tab to filter voicemails
- Tap voicemail cards to mark as read
- Pull to refresh for latest data
- Long press for additional options

## 🆘 Need Help?

- Check BUILD_INSTRUCTIONS.md for detailed build info
- Review Expo docs: https://docs.expo.dev
- Check React Native docs: https://reactnative.dev

---

**Ready to build?** Run `eas build -p android --profile preview` to create your APK! 🎉
