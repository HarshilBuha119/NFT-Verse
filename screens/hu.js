import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Linking, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const API_BASE_URL = 'https://api.opensea.io/api/v2';
const OPENSEA_API_KEY = '246f4d15156545e9804ecf6154163b70'; // Replace this with your actual API key

const NFTCollectionsScreen = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections?limit=10`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-KEY': OPENSEA_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching collections: ${response.status}`);
      }

      const data = await response.json();

      const formatted = data.collections.map((collection: any) => ({
        name: collection.name,
        image_url: collection.image_url,
        opensea_url: collection.opensea_url,
      }));

      setCollections(formatted);
    } catch (error) {
      console.error('Error fetching NFT collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={collections}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => Linking.openURL(item.opensea_url)} style={styles.card}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NFTCollectionsScreen;
