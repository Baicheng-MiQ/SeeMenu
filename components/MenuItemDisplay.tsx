import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { MenuItem } from '../types/menu';
import { useImageSearch } from '../types/imageSearch';

type Props = {
  item: MenuItem;
};

export default function MenuItemDisplay({ item }: Props) {
  const [{ urls, loading, error }, searchImages] = useImageSearch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            <Image 
              source={{ uri: urls[currentImageIndex] }} 
              style={styles.itemImage} 
              resizeMode="cover"
              onError={handleImageError}
            />
        )}
       </View>
       {item.search_term && <Text style={styles.itemSearchTerm}>Search Term: {item.search_term}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contentContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start', // Align items to the top
  },
  textContainer: {
      flex: 1, // Takes up remaining space
      marginRight: 10, // Add some space between text and image
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Add space below header
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1, // Allow name to shrink if needed
    marginRight: 8, // Add space between name and price
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginLeft: 'auto', // Push price to the right
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemSearchTerm: { // Optional: Keep if you want to display the search term
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 6,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor: '#eee', // Placeholder background
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
}); 