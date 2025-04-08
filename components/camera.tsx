import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraProps {
  onPictureTaken?: (photo: string) => void;
  disableShutter?: boolean;
  active?: boolean;
}

export default function Camera({ onPictureTaken, disableShutter = false, active = true }: CameraProps) {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [pictureSizes, setPictureSizes] = useState<string[]>([]);

  useEffect(() => {
    const checkPermission = async () => {
      if (permission?.granted) {
        setPictureSizes(await cameraRef.current?.getAvailablePictureSizesAsync() ?? []);
      }
    };
    
    checkPermission();
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current && !disableShutter) {
      const photo = await cameraRef.current.takePictureAsync();
      onPictureTaken?.(photo?.uri ?? '');
    }
  };

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

  return (
    <View style={styles.container}>
      <CameraView 
        active={active}
        style={styles.camera} 
        facing={'back'}
        autofocus='on'
        enableTorch={torch}
        pictureSize={pictureSizes[0]}
        ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, disableShutter && styles.disabledButton]} 
            onPress={takePicture}
            disabled={disableShutter}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setTorch(!torch)}>
            <Text style={styles.text}>Torch</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
