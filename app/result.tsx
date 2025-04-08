import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { getGenerativeModel, Schema } from "firebase/vertexai";
import { vertexAI } from "@/configs/firebaseConfig";
import CategoryDisplay from "../components/CategoryDisplay";

type MenuItem = {
  name: string;
  description?: string;
  price?: number;
};

type Category = {
  category_name: string;
  items: MenuItem[];
};

type MenuData = {
  categories: Category[];
};

export default function Result() {
  const photos = JSON.parse(useLocalSearchParams().photos as string) as string[];
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzeImages();
  }, []);

  // Convert image URI to base64 data
  async function imageUriToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }

  // Convert image to GenerativePart format
  async function imageToGenerativePart(uri: string) {
    const base64Data = await imageUriToBase64(uri);
    // Determine mime type based on URI extension
    const mimeType = uri.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    return {
      inlineData: { data: base64Data, mimeType },
    };
  }

  async function analyzeImages() {
    try {
      // Define the schema for structured output
      const menuSchema = Schema.object({
        properties: {
          categories: Schema.array({
            items: Schema.object({
              properties: {
                category_name: Schema.string(),
                items: Schema.array({
                  items: Schema.object({
                    properties: {
                      name: Schema.string(),
                      description: Schema.string(),
                      price: Schema.number(),
                    },
                    optionalProperties: ["description", "price"],
                  }),
                }),
              },
            }),
          }),
        },
      });

      // Create GenerativeModel instance with schema
      const model = getGenerativeModel(vertexAI, { 
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: menuSchema
        }
      });

      // Create prompt and convert images
      const prompt = "These are images of a restaurant menu. Extract all menu items into categories. For each item, extract the name, description (if available), and price (if available). Return the data as a structured menu.";
      const imageParts = await Promise.all(photos.map(imageToGenerativePart));

      // Generate content
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      const jsonResponse = JSON.parse(response.text());
      setMenuData(jsonResponse);
      
    } catch (error) {
      console.error("Error analyzing images:", error);
      setError("Error analyzing menu images. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const renderMenu = () => {
    if (!menuData) return null;
    
    return menuData.categories.map((category, index) => (
      <CategoryDisplay key={index} category={category} />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagesContainer}>
        {photos.map((photo, index) => (
          <Image key={index} source={{uri: photo}} style={styles.image} />
        ))}
      </View>
      
      <View style={styles.analysisContainer}>
        <Text style={styles.title}>Menu Items</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Analyzing menu...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          renderMenu()
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: '32%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  analysisContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  }
});
