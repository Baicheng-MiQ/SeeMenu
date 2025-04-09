import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Text, 
  StyleSheet, 
  Dimensions,
  GestureResponderEvent
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GalleryProps {
  photos: string[];
  onPhotoSelect?: (photoUri: string) => void;
  onPhotoDelete?: (photoUri: string) => void;
  onSubmit?: () => void;
}

export default function Gallery({ photos, onPhotoSelect, onPhotoDelete, onSubmit }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handlePhotoPress = (photoUri: string) => {
    setSelectedPhoto(photoUri);
    if (onPhotoSelect) {
      onPhotoSelect(photoUri);
    }
  };

  const handlePhotoDelete = (e: GestureResponderEvent, photoUri: string) => {
    e.stopPropagation();
    if (onPhotoDelete) {
      onPhotoDelete(photoUri);
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
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={(e) => handlePhotoDelete(e, photo)}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.submitButton, photos.length === 0 && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={photos.length === 0}
      >
          <MaterialCommunityIcons 
            name="star-four-points-outline" 
            size={24} 
            color="white" 
          />

      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    position: 'relative',
    minHeight: 110,
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
    bottom: 40,
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
  submitButton: {
    position: 'absolute',
    right: 15,
    bottom: 25,
    borderRadius: 99999999,
    overflow: 'hidden',
    backgroundColor: '#FF5C00',
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#FF5C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 