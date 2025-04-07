import React from "react";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import Camera from "./camera";
import Gallery from "@/components/Gallery";

export default function Index() {
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePictureTaken = (photoUri: string) => {
    setPhotos([...photos, photoUri]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera onPictureTaken={handlePictureTaken} />
      </View>
      <View style={styles.galleryContainer}>
        <Gallery photos={photos} />
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
