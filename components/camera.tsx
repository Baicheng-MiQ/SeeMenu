import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onPictureTaken?.(result.assets[0].uri);
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
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.shutterButton, disableShutter && styles.disabledButton]} 
            onPress={takePicture}
            disabled={disableShutter}>
              <MaterialIcons name="menu-book" size={24} color="darkorange" style={{textAlign: 'center', marginTop: 20}} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => setTorch(!torch)}>
            <MaterialIcons name={torch ? "flash-on" : "flash-off"} size={24} color="white" />
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
    width: '100%'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
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
