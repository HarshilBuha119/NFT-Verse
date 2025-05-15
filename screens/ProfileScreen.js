"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import { BlurView } from "@react-native-community/blur"
import Icon from "react-native-vector-icons/Ionicons"
import MaskedView from "@react-native-masked-view/masked-view"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

// Mock data for user NFTs
const USER_NFTS = [
  {
    id: "1",
    name: "Cosmic Perspective #231",
    price: "0.45 ETH",
    image: "https://picsum.photos/id/1/400/400",
  },
  {
    id: "2",
    name: "Digital Dreams #08",
    price: "0.2 ETH",
    image: "https://picsum.photos/id/20/400/400",
  },
  {
    id: "3",
    name: "Abstract Reality #45",
    price: "0.75 ETH",
    image: "https://picsum.photos/id/37/400/400",
  },
  {
    id: "4",
    name: "Future Nostalgia #12",
    price: "0.3 ETH",
    image: "https://picsum.photos/id/42/400/400",
  },
]

// Mock data for user activity
const USER_ACTIVITY = [
  {
    id: "1",
    type: "purchase",
    title: "Purchased NFT",
    description: "Cosmic Perspective #231",
    amount: "-0.45 ETH",
    date: "2 hours ago",
  },
  {
    id: "2",
    type: "sale",
    title: "Sold NFT",
    description: "Digital Dreams #08",
    amount: "+0.2 ETH",
    date: "1 day ago",
  },
  {
    id: "3",
    type: "mint",
    title: "Created NFT",
    description: "Abstract Reality #45",
    date: "3 days ago",
  },
]

// Tabs for profile content
const TABS = ["Collected", "Created", "Activity"]

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState("Collected")

  // Animation values
  const headerTranslateY = useSharedValue(-50)
  const headerOpacity = useSharedValue(0)
  const profileTranslateY = useSharedValue(30)
  const profileOpacity = useSharedValue(0)
  const statsTranslateY = useSharedValue(30)
  const statsOpacity = useSharedValue(0)
  const tabsTranslateY = useSharedValue(30)
  const tabsOpacity = useSharedValue(0)
  const contentTranslateY = useSharedValue(30)
  const contentOpacity = useSharedValue(0)

  useEffect(() => {
    // Animate header
    headerTranslateY.value = withTiming(0, { duration: 800 })
    headerOpacity.value = withTiming(1, { duration: 800 })

    // Animate profile
    profileTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }))
    profileOpacity.value = withDelay(200, withTiming(1, { duration: 800 }))

    // Animate stats
    statsTranslateY.value = withDelay(400, withTiming(0, { duration: 800 }))
    statsOpacity.value = withDelay(400, withTiming(1, { duration: 800 }))

    // Animate tabs
    tabsTranslateY.value = withDelay(600, withTiming(0, { duration: 800 }))
    tabsOpacity.value = withDelay(600, withTiming(1, { duration: 800 }))

    // Animate content
    contentTranslateY.value = withDelay(800, withTiming(0, { duration: 800 }))
    contentOpacity.value = withDelay(800, withTiming(1, { duration: 800 }))
  }, [])

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
      opacity: headerOpacity.value,
    }
  })

  const profileStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: profileTranslateY.value }],
      opacity: profileOpacity.value,
    }
  })

  const statsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: statsTranslateY.value }],
      opacity: statsOpacity.value,
    }
  })

  const tabsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabsTranslateY.value }],
      opacity: tabsOpacity.value,
    }
  })

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
      opacity: contentOpacity.value,
    }
  })

  const renderNFTItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.nftItem} onPress={() => navigation.navigate("NFTDetail", { nft: item })}>
        <View style={styles.nftImageContainer}>
          <Image source={{ uri: item.image }} style={styles.nftImage} />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.nftGradient} />
          <View style={styles.nftInfo}>
            <Text style={styles.nftName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.nftPrice}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderActivityItem = ({ item }) => {
    return (
      <View style={styles.activityItem}>
        <View style={styles.activityLeft}>
          <View
            style={[
              styles.activityIcon,
              {
                backgroundColor:
                  item.type === "purchase"
                    ? "rgba(255,61,255,0.2)"
                    : item.type === "sale"
                      ? "rgba(0,255,179,0.2)"
                      : "rgba(0,195,255,0.2)",
              },
            ]}
          >
            <Icon
              name={
                item.type === "purchase" ? "cart-outline" : item.type === "sale" ? "cash-outline" : "create-outline"
              }
              size={18}
              color={item.type === "purchase" ? "#FF3DFF" : item.type === "sale" ? "#00FFB3" : "#00C3FF"}
            />
          </View>
          <View>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDescription}>{item.description}</Text>
            <Text style={styles.activityDate}>{item.date}</Text>
          </View>
        </View>
        {item.amount && (
          <MaskedView
            maskElement={
              <Text
                style={[
                  styles.activityAmount,
                  {
                    color: item.amount.startsWith("+") ? "#00FFB3" : "#FF3DFF",
                  },
                ]}
              >
                {item.amount}
              </Text>
            }
          >
            <LinearGradient
              colors={item.amount.startsWith("+") ? ["#00FFB3", "#00B3FF"] : ["#FF3DFF", "#5D00FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </MaskedView>
        )}
      </View>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Collected":
      case "Created":
        return (
          <FlatList
            data={USER_NFTS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderNFTItem}
            contentContainerStyle={styles.nftGrid}
            scrollEnabled={false}
          />
        )
      case "Activity":
        return (
          <View style={styles.activityContainer}>
            {USER_ACTIVITY.map((item) => (
              <View key={item.id}>{renderActivityItem({ item })}</View>
            ))}
          </View>
        )
      default:
        return null
    }
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
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <View
            style={styles.settingsButtonInner}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
          >
            <Icon name="settings-outline" size={22} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <Animated.View style={[styles.profileContainer, profileStyle]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: "https://picsum.photos/id/64/200/200" }} style={styles.profileImage} />
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={16} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <View style={styles.addressContainer}>
                <Text style={styles.profileAddress}>0x1a2b...3c4d</Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Icon name="copy-outline" size={14} color="#FF3DFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileBio}>Digital artist and NFT creator</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.editButton}>
              <View
                style={styles.editButtonInner}
                blurType="dark"
                blurAmount={20}
                reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
              >
                <Icon name="create-outline" size={16} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <View
                style={styles.shareButtonInner}
                blurType="dark"
                blurAmount={20}
                reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
              >
                <Icon name="share-social-outline" size={16} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsContainer, statsStyle]}>
          <View
            style={styles.statsCard}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
          >
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3.2K</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.8K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>284</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tabs */}
        <Animated.View style={[styles.tabsContainer, tabsStyle]}>
          <View
            style={styles.tabsCard}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                {activeTab === tab && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.contentContainer, contentStyle]}>{renderTabContent()}</Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  settingsButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  settingsButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  profileContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF3DFF",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF3DFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0A0A12",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profileAddress: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginRight: 5,
  },
  copyButton: {
    padding: 2,
  },
  profileBio: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  profileActions: {
    flexDirection: "row",
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  editButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 5,
  },
  shareButton: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  shareButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 5,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "center",
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabsCard: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: "#FF3DFF",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  nftGrid: {
    paddingBottom: 20,
  },
  nftItem: {
    width: (width - 50) / 2,
    marginBottom: 10,
    marginRight: 10,
  },
  nftImageContainer: {
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  nftImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
  },
  nftGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  nftInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  nftName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  nftPrice: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FF3DFF",
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  activityDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  activityDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
