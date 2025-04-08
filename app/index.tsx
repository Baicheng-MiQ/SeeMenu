import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import Camera from "@/components/camera";
import Gallery from "@/components/Gallery";
import { router, useNavigation } from "expo-router";

export default function Index() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  
  useEffect(() => {
    setCameraOn(isFocused);
  }, [isFocused]);

  const handlePictureTaken = (photoUri: string) => {
    if (photos.length < 3) {
      setPhotos([...photos, photoUri]);
    }
  };

  const handlePhotoDelete = (photoUri: string) => {
    setPhotos(photos.filter(uri => uri !== photoUri));
  };

  const handleSubmit = () => {
    router.push({
      pathname: "/result",
      params: { photos:JSON.stringify(photos) }
    });
    setCameraOn(false);
    setPhotos([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera 
          active={cameraOn}
          onPictureTaken={handlePictureTaken} 
          disableShutter={photos.length >= 3} 
        />
      </View>
      <View style={styles.galleryContainer}>
        <Gallery photos={photos} onPhotoDelete={handlePhotoDelete} onSubmit={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 0.9,
  },
  galleryContainer: {
    flex: 0.15,
  },
});
