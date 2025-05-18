'use client';

import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

// Mock data for trending collections

const API_KEY = '246f4d15156545e9804ecf6154163b70';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
};

export default function DetailCollection({navigation,route}) {
  const API_BASE_URL=route.params.api
  const PageName=route.params.name
  
  const insets = useSafeAreaInsets();
  const [featuredNFTs, setFeaturedNFTs] = useState([]);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        // Fetch featured NFTs (from Bored Ape Yacht Club)
        const nftResponse = await fetch(
          `${API_BASE_URL}`,
          {
            method: 'GET',
            headers: HEADERS,
          },
        );
        console.log(nftResponse);

        if (!nftResponse.ok) {
          throw new Error(`NFT API error: ${nftResponse.status}`);
        }
        const nftData = await nftResponse.json();

        // Fetch trending collections
        
        
        const formattedNFTs =
          nftData.nfts?.map((collection, index) => ({
            id: collection.identifiers,
            name: collection.name,
            author: collection.collection,
            image: collection.display_image_url,
            likes: Math.floor(Math.random() * 500), // OpenSea doesn't provide likes
            description:collection.description
          })) || [];
        setFeaturedNFTs(formattedNFTs);
      } catch (err) {
        console.error('OpenSea API Error:', err);
      } finally {
        console.log('NONE');
      }
    };

    fetchNFTData();
  }, []);

  // Animation values
  const featuredTranslateY = useSharedValue(30);
  const featuredOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate featured
    featuredTranslateY.value = withDelay(600, withTiming(0, {duration: 800}));
    featuredOpacity.value = withDelay(600, withTiming(1, {duration: 800}));
  }, []);

  const featuredStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: featuredTranslateY.value}],
      opacity: featuredOpacity.value,
    };
  });

  const renderFeaturedItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.featuredItem}
        onPress={() => navigation.navigate('NFTDetail', {nft: item})}>
        <View style={styles.featuredImageContainer}>
          <Image source={{uri: item.image}} style={styles.featuredImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.featuredGradient}
          />
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.featuredCreator}>
              <Text style={styles.featuredCreatorText}>
                by <Text style={styles.featuredCreatorName}>{item.author}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.featuredPrice}>
            <MaskedView
              maskElement={
                <Text style={styles.featuredPriceText}>0.1 ETH</Text>
              }>
              <LinearGradient
                colors={['#FF3DFF', '#5D00FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{flex: 1}}
              />
            </MaskedView>
          </View>
          <View style={styles.featuredLikes}>
            <Icon name="heart" size={14} color="#FF3DFF" />
            <Text style={styles.featuredLikesText}>{item.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <LinearGradient
        colors={['#0A0A12', '#1A103D']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.background}
      />

      <ScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Featured NFTs */}
        <Animated.View style={[styles.featuredContainer, featuredStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{PageName} NFT</Text>
          </View>
          <FlatList
            data={featuredNFTs}
            keyExtractor={item => item.id}
            renderItem={renderFeaturedItem}
            contentContainerStyle={styles.featuredList}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuredContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    alignItems: 'center',
    marginVertical: 35,
  },
  sectionTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign:'center'
  },
  featuredList: {
    alignItems:"center",
    gap:25
  },
  featuredItem: {
    width: width * 0.75,
    marginRight: 15,
  },
  featuredImageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredCreator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredCreatorText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  featuredCreatorName: {
    color: '#FF3DFF',
  },
  featuredPrice: {
    position: 'absolute',
    top: 15,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featuredPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featuredLikes: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featuredLikesText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 5,
  },
});
