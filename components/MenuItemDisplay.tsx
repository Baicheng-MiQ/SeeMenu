import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type MenuItem = {
  name: string;
  description?: string;
  price?: number;
};

type Props = {
  item: MenuItem;
};

export default function MenuItemDisplay({ item }: Props) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.price && <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>}
      </View>
      {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
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
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1, // Ensure name takes available space
    marginRight: 8, // Add space between name and price
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 