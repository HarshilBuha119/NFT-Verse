"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import { BlurView } from "@react-native-community/blur"
import Icon from "react-native-vector-icons/Ionicons"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated"

// Mock data for notifications
const NOTIFICATIONS = [
  {
    id: "1",
    type: "bid",
    title: "New Bid Received",
    message: 'Someone placed a bid of 0.45 ETH on your NFT "Cosmic Perspective #231"',
    time: "2 hours ago",
    read: false,
    image: "https://i.seadn.io/s/raw/files/c769d4b0f2fe5bc90f0ab9fba0d754f8.png?w=500&auto=format",
  },
  {
    id: "2",
    type: "sale",
    title: "NFT Sold",
    message: 'Your NFT "Digital Dreams #08" was sold for 0.2 ETH',
    time: "1 day ago",
    read: false,
    image: "https://i.seadn.io/gae/b1bKf4Z1cje-OhJxsBvH1ToCTIG-JyPXQwn_qRnvHp4yETrdzOzJI4qC9Vf5vmZuPhUqagU8Y0fMgEKBqO8NMWiZg4rHhBiXGlYf?w=500&auto=format",
  },
  {
    id: "3",
    type: "transfer",
    title: "ETH Received",
    message: "You received 0.5 ETH from 0x1a2b...3c4d",
    time: "2 days ago",
    read: true,
  },
  {
    id: "4",
    type: "like",
    title: "New Like",
    message: 'CryptoArtist liked your NFT "Abstract Reality #45"',
    time: "3 days ago",
    read: true,
    image: "https://i.seadn.io/s/raw/files/dfc76e451497a427ac57afd910f42b7f.png?w=500&auto=format",
  },
  {
    id: "5",
    type: "follow",
    title: "New Follower",
    message: "NFTCreator started following you",
    time: "4 days ago",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "Welcome to Nexus",
    message: "Welcome to Nexus NFT Marketplace! Start exploring and collecting NFTs today.",
    time: "1 week ago",
    read: true,
  },
]

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  // Animation values
  const headerTranslateY = useSharedValue(-50)
  const headerOpacity = useSharedValue(0)
  const contentTranslateY = useSharedValue(30)
  const contentOpacity = useSharedValue(0)

  useEffect(() => {
    // Animate header
    headerTranslateY.value = withTiming(0, { duration: 800 })
    headerOpacity.value = withTiming(1, { duration: 800 })

    // Animate content
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }))
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }))
  }, [])

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
      opacity: headerOpacity.value,
    }
  })

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
      opacity: contentOpacity.value,
    }
  })

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const renderNotificationIcon = (type) => {
    let iconName
    let iconColor
    let bgColor

    switch (type) {
      case "bid":
        iconName = "cash-outline"
        iconColor = "#FF3DFF"
        bgColor = "rgba(255,61,255,0.2)"
        break
      case "sale":
        iconName = "cart-outline"
        iconColor = "#00FFB3"
        bgColor = "rgba(0,255,179,0.2)"
        break
      case "transfer":
        iconName = "arrow-down-outline"
        iconColor = "#00C3FF"
        bgColor = "rgba(0,195,255,0.2)"
        break
      case "like":
        iconName = "heart-outline"
        iconColor = "#FF3DFF"
        bgColor = "rgba(255,61,255,0.2)"
        break
      case "follow":
        iconName = "person-add-outline"
        iconColor = "#00C3FF"
        bgColor = "rgba(0,195,255,0.2)"
        break
      default:
        iconName = "information-circle-outline"
        iconColor = "#FFFFFF"
        bgColor = "rgba(255,255,255,0.2)"
    }

    return (
      <View style={[styles.notificationIcon, { backgroundColor: bgColor }]}>
        <Icon name={iconName} size={20} color={iconColor} />
      </View>
    )
  }

  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationItem, item.read ? styles.notificationRead : styles.notificationUnread]}
      >
        {renderNotificationIcon(item.type)}

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>

          {item.image && <Image source={{ uri: item.image }} style={styles.notificationImage} />}
        </View>

        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearButton} onPress={markAllAsRead} disabled={unreadCount === 0}>
          <BlurView
            style={[styles.clearButtonInner, unreadCount === 0 && { opacity: 0.5 }]}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
          >
            <Icon name="checkmark-done-outline" size={20} color="#FFFFFF" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, contentStyle]}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off-outline" size={60} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>When you receive notifications, they will appear here</Text>
          </View>
        )}
      </Animated.View>
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
  clearButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  clearButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  content: {
    flex: 1,
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    position: "relative",
  },
  notificationUnread: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
  },
  notificationRead: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginLeft: 10,
  },
  notificationMessage: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
  notificationImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  unreadIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3DFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.7)",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
  },
})
