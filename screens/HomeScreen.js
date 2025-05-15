"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaskedView from "@react-native-masked-view/masked-view"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

// Mock data for trending collections
const TRENDING_COLLECTIONS = [
  {
    id: "1",
    name: "Bored Ape Yacht Club",
    items: 10000,
    volume: "8.5K ETH",
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*2BoJwmscMEJ7JpRMR_x7uQ.png",
    banner: "https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/9ef356b03f7169893257292d73553d/f49ef356b03f7169893257292d73553d.png?w=350",
    verified: true,
    API_BASE_URL : 'https://api.opensea.io/api/v2/collection/bored-ape/nfts?limit=50'
  },
  {
    id: "2",
    name: "Clone X",
    items: 10000,
    volume: "7.2K ETH",
    image: "https://i2.seadn.io/ethereum/0x5af0d9827e0c53e4799bb226655a1de152a425a5/ad263d23ee2a698aea42b85fe84e8c65.png?w=1000",
    banner: "https://www.todaynftnews.com/wp-content/uploads/2023/05/milady-maker-nft.jpg",
    verified: true,
    API_BASE_URL: "https://api.opensea.io/api/v2/collection/clonex/nfts?limit=50"
  },
  {
    id: "3",
    name: "Azuki",
    items: 5000,
    volume: "3.1K ETH",
    image: "https://i.seadn.io/s/raw/files/18f452464ab0f3e48c5adbf503b79db7.png?w=500&auto=format",
    banner: "https://i.seadn.io/s/raw/files/18f452464ab0f3e48c5adbf503b79db7.png?w=500&auto=format",
    verified: false,
    API_BASE_URL: "https://api.opensea.io/api/v2/collection/azuki/nfts?limit=50"
  },
]

const API_KEY = "246f4d15156545e9804ecf6154163b70"
const API_BASE_URL = "https://api.opensea.io/api/v2"
const HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": API_KEY,
}


// Mock data for categories
const CATEGORIES = [
  { id: "1", name: "Art", icon: "color-palette-outline" },
  { id: "2", name: "Music", icon: "musical-notes-outline" },
  { id: "3", name: "Virtual Worlds", icon: "planet-outline" },
  { id: "4", name: "Collectibles", icon: "diamond-outline" },
  { id: "5", name: "Sports", icon: "football-outline" },
  { id: "6", name: "Photography", icon: "camera-outline" },
]

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("1")
  const [featuredNFTs, setFeaturedNFTs] = useState([])

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        // Fetch featured NFTs (from Bored Ape Yacht Club)
        const nftResponse = await fetch(
          `${API_BASE_URL}/collection/azuki/nfts?limit=10`,
          {
            method: "GET",
            headers: HEADERS,
          }
        )
        console.log(nftResponse);
        
        if (!nftResponse.ok) {
          throw new Error(`NFT API error: ${nftResponse.status}`)
        }
        const nftData = await nftResponse.json()
        
        

        // Fetch trending collections
        const collectionsResponse = await fetch(
          `${API_BASE_URL}/collections?limit=10`,
          {
            method: "GET",
            headers: HEADERS,
          }
        )
        if (!collectionsResponse.ok) {
          throw new Error(`Collections API error: ${collectionsResponse.status}`)
        }
        const collectionsData = await collectionsResponse.json()
        console.log(collectionsData);
        
        const formattedCollections = collectionsData.collections?.map((collection, index) => ({
          id: collection.collection || index.toString(),
          name: collection.collection || `Collection #${index + 1}`,
          image:collection.image_url,
          author:collection.name
        })) || []

        const formattedNFTs = nftData.nfts?.map((collection, index) => ({
          id: collection.identifiers ,
          name: collection.name ,
          author:collection.collection,
          image: collection.display_image_url,
          likes: Math.floor(Math.random() * 500), // OpenSea doesn't provide likes
        })) || []
        console.log(formattedNFTs)
        console.log(formattedNFTs.id,formattedNFTs.name,formattedNFTs.author,formattedNFTs.price,formattedNFTs.image,formattedNFTs.likes);
        setFeaturedNFTs(formattedNFTs)
      } catch (err) {
        console.error("OpenSea API Error:", err)
        
      } finally {
        console.log("NONE");
        
      }
    }

    fetchNFTData()
  }, [])

  // Animation values
  const headerTranslateY = useSharedValue(-50)
  const headerOpacity = useSharedValue(0)
  const searchTranslateY = useSharedValue(30)
  const searchOpacity = useSharedValue(0)
  const categoriesTranslateX = useSharedValue(-30)
  const categoriesOpacity = useSharedValue(0)
  const featuredTranslateY = useSharedValue(30)
  const featuredOpacity = useSharedValue(0)
  const trendingTranslateY = useSharedValue(30)
  const trendingOpacity = useSharedValue(0)

  useEffect(() => {
    // Animate header
    headerTranslateY.value = withTiming(0, { duration: 800 })
    headerOpacity.value = withTiming(1, { duration: 800 })

    // Animate search
    searchTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }))
    searchOpacity.value = withDelay(200, withTiming(1, { duration: 800 }))

    // Animate categories
    categoriesTranslateX.value = withDelay(400, withTiming(0, { duration: 800 }))
    categoriesOpacity.value = withDelay(400, withTiming(1, { duration: 800 }))

    // Animate featured
    featuredTranslateY.value = withDelay(600, withTiming(0, { duration: 800 }))
    featuredOpacity.value = withDelay(600, withTiming(1, { duration: 800 }))

    // Animate trending
    trendingTranslateY.value = withDelay(800, withTiming(0, { duration: 800 }))
    trendingOpacity.value = withDelay(800, withTiming(1, { duration: 800 }))
  }, [])

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
      opacity: headerOpacity.value,
    }
  })

  const searchStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: searchTranslateY.value }],
      opacity: searchOpacity.value,
    }
  })

  const categoriesStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: categoriesTranslateX.value }],
      opacity: categoriesOpacity.value,
    }
  })

  const featuredStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: featuredTranslateY.value }],
      opacity: featuredOpacity.value,
    }
  })

  const trendingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: trendingTranslateY.value }],
      opacity: trendingOpacity.value,
    }
  })

  const renderFeaturedItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.featuredItem} onPress={() => navigation.navigate("NFTDetail", { nft: item })}>
        <View style={styles.featuredImageContainer}>
          <Image source={{uri:item.image}} style={styles.featuredImage} />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.featuredGradient} />
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
            <MaskedView maskElement={<Text style={styles.featuredPriceText}>0.1 ETH</Text>}>
              <LinearGradient
                colors={["#FF3DFF", "#5D00FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
          </View>
          <View style={styles.featuredLikes}>
            <Icon name="heart" size={14} color="#FF3DFF" />
            <Text style={styles.featuredLikesText}>{item.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const handleAzuki=(api,name)=>{
    navigation.navigate("DetailCollection",{api,name})
    console.log("handle");
    
  }
  const renderCollectionItem = ({ item }) => {

    return (
      <TouchableOpacity style={styles.collectionItem} onPress={()=>handleAzuki(item.API_BASE_URL,item.name)}>
        <View style={styles.collectionBannerContainer}>
          <Image source={{ uri: item.banner }} style={styles.collectionBanner} />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.collectionBannerGradient} />
        </View>
        <View style={styles.collectionContent}>
          <View style={styles.collectionImageContainer}>
            <Image source={{ uri: item.image }} style={styles.collectionImage} />
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.collectionInfo}>
            <Text style={styles.collectionName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.collectionStats}>
              <View style={styles.collectionStat}>
                <Text style={styles.collectionStatLabel}>Items</Text>
                <Text style={styles.collectionStatValue}>{item.items}</Text>
              </View>
              <View style={styles.collectionStat}>
                <Text style={styles.collectionStatLabel}>Volume</Text>
                <Text style={styles.collectionStatValue}>{item.volume}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory === item.id

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <View style={[styles.categoryIcon, isSelected && styles.categoryIconSelected]}>
          <Icon name={item.icon} size={20} color={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.7)"} />
        </View>
        <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#0A0A12", "#1A103D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>MARKETPLACE</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications-outline" size={22} color="#FFFFFF" />
              <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, searchStyle]}>
          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search NFTs, collections, users..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View style={[styles.categoriesContainer, categoriesStyle]}>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </Animated.View>

        {/* Featured NFTs */}
        <Animated.View style={[styles.featuredContainer, featuredStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured NFTs</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("DetailCollection")}>
              <Text style={styles.sectionAction}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredNFTs}
            keyExtractor={(item) => item.id}
            renderItem={renderFeaturedItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </Animated.View>

        {/* Trending Collections */}
        <Animated.View style={[styles.trendingContainer, trendingStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Collections</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={TRENDING_COLLECTIONS}
            keyExtractor={(item) => item.id}
            renderItem={renderCollectionItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </Animated.View>
      </ScrollView>
    </View>
  )
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  iconButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  notificationBadge: {
    position: "absolute",
    top: 1,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3DFF",
  },
  searchContainer: {
    alignItems:"center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryItemSelected: {},
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  categoryIconSelected: {
    backgroundColor: "rgba(255,61,255,0.2)",
    borderColor: "#FF3DFF",
  },
  categoryName: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  categoryNameSelected: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  featuredContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionAction: {
    fontSize: 14,
    color: "#FF3DFF",
    fontWeight: "500",
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  featuredItem: {
    width: width * 0.75,
    marginRight: 15,
  },
  featuredImageContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: 300,
    borderRadius: 20,
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  featuredInfo: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  featuredCreator: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredCreatorText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  featuredCreatorName: {
    color: "#FF3DFF",
  },
  featuredPrice: {
    position: "absolute",
    top: 15,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  featuredPriceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  featuredLikes: {
    position: "absolute",
    top: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  featuredLikesText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 5,
  },
  trendingContainer: {
    marginBottom: 30,
  },
  trendingList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  collectionItem: {
    width: width * 0.7,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  collectionBannerContainer: {
    position: "relative",
    height: 120,
  },
  collectionBanner: {
    width: "100%",
    height: "100%",
  },
  collectionBannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  collectionContent: {
    flexDirection: "row",
    padding: 15,
  },
  collectionImageContainer: {
    position: "relative",
    marginTop: -30,
    marginRight: 15,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.1)",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF3DFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0A0A12",
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  collectionStats: {
    flexDirection: "row",
  },
  collectionStat: {
    marginRight: 20,
  },
  collectionStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 3,
  },
  collectionStatValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
})
