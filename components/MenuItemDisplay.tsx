import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MenuItem } from '../types/menu';
import { useImageSearch } from '../types/imageSearch';

type Props = {
  item: MenuItem;
};

export default function MenuItemDisplay({ item }: Props) {
  const [{ urls, loading, error }, searchImages] = useImageSearch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);

  useEffect(() => {
    if (item.search_term) {
      searchImages(item.search_term);
    }
    // Reset image index when search term changes
    setCurrentImageIndex(0);
  }, [item.search_term]); // Re-run search if search_term changes

  const handleImageError = () => {
    if (currentImageIndex < urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <View style={styles.menuItem}>
       <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
            <View style={styles.menuItemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.price != null && typeof item.price === 'number' && <Text style={styles.itemPrice}>{item.price.toFixed(2)}</Text>}
            </View>
            {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
        </View>
        {loading && <ActivityIndicator size="small" style={styles.loadingIndicator} color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {urls.length > 0 && !loading && !error && (
            <TouchableOpacity onPress={() => setFullScreenVisible(true)}>
              <Image 
                source={{ uri: urls[currentImageIndex] }} 
                style={styles.itemImage} 
                resizeMode="cover"
                onError={handleImageError}
              />
            </TouchableOpacity>
        )}
       </View>
       {/* {item.search_term && <Text style={styles.itemSearchTerm}>Showing image for: {item.search_term}</Text>} */}
       
       <Modal
          visible={fullScreenVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFullScreenVisible(false)}
        >
          <TouchableOpacity 
            style={styles.fullScreenModal} 
            activeOpacity={1} 
            onPress={() => setFullScreenVisible(false)}
          >
            {urls.length > 0 && (
              <Image
                source={{ uri: urls[currentImageIndex] }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textContainer: {
      flex: 1, // Takes up remaining space
      marginRight: 10, // Add some space between text and image
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'baseline',
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    maxWidth: '70%',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d9f5c',
    backgroundColor: '#f0faf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    marginTop: 4,
  },
  itemSearchTerm: {
    fontSize: 11,
    color: '#888',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginTop: 4,
  },
  loadingIndicator: {
    //center the loading indicator
    alignSelf: 'center',
    marginRight: 40,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
}); 