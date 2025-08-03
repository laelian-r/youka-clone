# Bienvenue dans l'application Expo "youka-clone" 👋

Ceci est un projet [Expo](https://expo.dev) créé avec [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Pour commencer

1. Installez les dépendances

   ```bash
   npm install
   ```

   ```bash
   npx expo install

   npx expo install expo-camera

   npx expo install axios

   npx expo install react-native-elements
   
   npx expo install @react-native-async-storage/async-storage
   ```

   Dans le fichier "app.json", ajouez les lignes suivantes :
   ```
   "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ]
   ]
   ```


2. Démarrez l'application

   ```bash
   npx expo start

   npm run ios
   
   npm run android
   ```