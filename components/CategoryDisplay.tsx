import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuItemDisplay from './MenuItemDisplay';

type MenuItem = {
  name: string;
  description?: string;
  price?: number;
};

type Category = {
  category_name: string;
  items: MenuItem[];
};

type Props = {
  category: Category;
};

export default function CategoryDisplay({ category }: Props) {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{category.category_name}</Text>
      {category.items.map((item, index) => (
        <MenuItemDisplay key={index} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
}); 