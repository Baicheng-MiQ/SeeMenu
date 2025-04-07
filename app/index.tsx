import React from "react";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import Camera from "./camera";
import Gallery from "@/components/Gallery";

export default function Index() {
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePictureTaken = (photoUri: string) => {
    if (photos.length < 3) {
      setPhotos([...photos, photoUri]);
    }
  };

  const handlePhotoDelete = (photoUri: string) => {
    setPhotos(photos.filter(uri => uri !== photoUri));
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera 
          onPictureTaken={handlePictureTaken} 
          disableShutter={photos.length >= 3} 
        />
      </View>
      <View style={styles.galleryContainer}>
        <Gallery photos={photos} onPhotoDelete={handlePhotoDelete} />
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
