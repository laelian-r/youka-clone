import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

const API_URL = "https://world.openfoodfacts.org/api/v2/product/";

export default function TabTwoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const saveItemsToStorage = async (product: any) => {
    try {
      // Check if the product already exists
      const products = await AsyncStorage.getItem("products");
      console.log("products", products);
      const savedProducts = products ? JSON.parse(products) : [];
      const index = savedProducts.findIndex((p: any) => p.code === product.code);

      if (index === -1) {
        savedProducts.unshift(product);
        await AsyncStorage.setItem("products", JSON.stringify([...savedProducts, product]));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleScan = async (scanningResult: BarcodeScanningResult) => {
    console.log("Scanned", scanningResult);

    try {
      // 1 Scanned
      setScanned(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        // 2 axio get API
        const response = await axios.get(
          API_URL + scanningResult.data + ".json?lc=fr"
        );
        console.log("response", response.data);

        if (response.data.status === 1) {
          // 3 save asyng storage
          const product = response.data.product;
          const grade = 6;

          await saveItemsToStorage({...product, grade});

          // 4 navigate to modal
        }
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {scanned && <View style={styles.feedback}>
        <ActivityIndicator color={"white"} />
      </View>}
      <CameraView style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8"],
        }}
        onBarcodeScanned={handleScan}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  feedback : {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
});
