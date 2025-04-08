import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { MenuItem } from '../types/menu';

type Props = {
  item: MenuItem;
};

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PROGRAMMABLE_SEARCH_ENGINE_KEY; // Replace with your actual API key
const CX_ID = process.env.EXPO_PUBLIC_GOOGLE_PROGRAMMABLE_SEARCH_ENGINE_ID; // Replace with your actual CX ID

export default function MenuItemDisplay({ item }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function searchImage() {
    if (!item.search_term) return;
    if (!API_KEY || !CX_ID ) {
        console.warn("API Key or CX ID is not configured.");
        setError("Image search not configured.");
        return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    } as RequestInit;

    const searchTerm = item.search_term.toLowerCase() + " food";
    const query = encodeURIComponent(searchTerm);
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${query}&searchType=image&safe=active&num=3&rights=cc_publicdomain,cc_attribute,cc_sharealike`;

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (result.items && result.items.length > 0 && result.items[0].link) {
        setImageUrl(result.items[0].link);
      } else {
          console.log("No image found for:", searchTerm);
        setError("No image found.");
      }
    } catch (fetchError) {
      console.error("Fetch Error:", fetchError);
      setError("Failed to fetch image.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchImage();
  }, [item.search_term]); // Re-run search if search_term changes

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
        {imageUrl && !loading && !error && (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} resizeMode="cover" />
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