import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';

interface GalleryProps {
  photos: string[];
  onPhotoSelect?: (photoUri: string) => void;
}

export default function Gallery({ photos, onPhotoSelect }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handlePhotoPress = (photoUri: string) => {
    setSelectedPhoto(photoUri);
    if (onPhotoSelect) {
      onPhotoSelect(photoUri);
    }
  };

  return (
    <View style={styles.container}>
      {selectedPhoto ? (
        <Modal visible={!!selectedPhoto} transparent={true} animationType="fade" >
          <TouchableOpacity style={styles.modalContainer} onPress={() => setSelectedPhoto(null)}>
            <Image source={{ uri: selectedPhoto }} style={styles.fullScreenImage} />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedPhoto(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      ) : null}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handlePhotoPress(photo)}
            style={styles.thumbnailContainer}
          >
            <Image source={{ uri: photo }} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  thumbnailContainer: {
    marginHorizontal: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 