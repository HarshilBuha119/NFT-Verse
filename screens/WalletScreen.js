"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaskedView from "@react-native-masked-view/masked-view"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

// Mock data for wallet assets
const WALLET_ASSETS = [
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    balance: "2.45",
    value: "$4,532.67",
    change: "+5.2%",
    positive: true,
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: "2",
    name: "USD Coin",
    symbol: "USDC",
    balance: "1,250.00",
    value: "$1,250.00",
    change: "0.0%",
    positive: true,
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    balance: "15.8",
    value: "$1,738.42",
    change: "-2.1%",
    positive: false,
    icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
]

// Mock data for recent transactions
const RECENT_TRANSACTIONS = [
  {
    id: "1",
    type: "purchase",
    title: "Purchased NFT",
    description: "Cosmic Perspective #231",
    amount: "-0.45 ETH",
    date: "2 hours ago",
    image: "https://picsum.photos/id/1/100/100",
  },
  {
    id: "2",
    type: "sale",
    title: "Sold NFT",
    description: "Digital Dreams #08",
    amount: "+0.2 ETH",
    date: "1 day ago",
    image: "https://picsum.photos/id/20/100/100",
  },
  {
    id: "3",
    type: "transfer",
    title: "Received Transfer",
    description: "From 0x1a2b...3c4d",
    amount: "+0.5 ETH",
    date: "2 days ago",
  },
  {
    id: "4",
    type: "transfer",
    title: "Sent Transfer",
    description: "To 0x4d3c...2b1a",
    amount: "-1.0 ETH",
    date: "3 days ago",
  },
]

// Tabs for wallet content
const TABS = ["Assets", "NFTs", "Activity"]

export default function WalletScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState("Assets")
  const [isWalletConnected, setIsWalletConnected] = useState(true)

  // Animation values
  const headerTranslateY = useSharedValue(-50)
  const headerOpacity = useSharedValue(0)
  const balanceTranslateY = useSharedValue(30)
  const balanceOpacity = useSharedValue(0)
  const actionsTranslateY = useSharedValue(30)
  const actionsOpacity = useSharedValue(0)
  const tabsTranslateY = useSharedValue(30)
  const tabsOpacity = useSharedValue(0)
  const contentTranslateY = useSharedValue(30)
  const contentOpacity = useSharedValue(0)

  useEffect(() => {
    // Animate header
    headerTranslateY.value = withTiming(0, { duration: 800 })
    headerOpacity.value = withTiming(1, { duration: 800 })

    // Animate balance
    balanceTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }))
    balanceOpacity.value = withDelay(200, withTiming(1, { duration: 800 }))

    // Animate actions
    actionsTranslateY.value = withDelay(400, withTiming(0, { duration: 800 }))
    actionsOpacity.value = withDelay(400, withTiming(1, { duration: 800 }))

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

  const balanceStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: balanceTranslateY.value }],
      opacity: balanceOpacity.value,
    }
  })

  const actionsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: actionsTranslateY.value }],
      opacity: actionsOpacity.value,
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

  const renderAssetItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.assetItem}>
        <View style={styles.assetLeft}>
          <Image source={{ uri: item.icon }} style={styles.assetIcon} />
          <View>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetBalance}>
              {item.balance} {item.symbol}
            </Text>
          </View>
        </View>
        <View style={styles.assetRight}>
          <Text style={styles.assetValue}>{item.value}</Text>
          <Text style={[styles.assetChange, item.positive ? styles.positiveChange : styles.negativeChange]}>
            {item.change}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderTransactionItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
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
                item.type === "purchase"
                  ? "cart-outline"
                  : item.type === "sale"
                    ? "cash-outline"
                    : item.type === "transfer" && item.amount.startsWith("+")
                      ? "arrow-down-outline"
                      : "arrow-up-outline"
              }
              size={18}
              color={item.type === "purchase" ? "#FF3DFF" : item.type === "sale" ? "#00FFB3" : "#00C3FF"}
            />
          </View>
          <View>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <MaskedView
          maskElement={
            <Text
              style={[
                styles.transactionAmount,
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
      </TouchableOpacity>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Assets":
        return (
          <View style={styles.assetsContainer}>
            <FlatList
              data={WALLET_ASSETS}
              keyExtractor={(item) => item.id}
              renderItem={renderAssetItem}
              scrollEnabled={false}
              contentContainerStyle={styles.assetsList}
            />
          </View>
        )
      case "NFTs":
        return (
          <View style={styles.nftsContainer}>
            <Text style={styles.emptyStateText}>No NFTs in this wallet yet</Text>
          </View>
        )
      case "Activity":
        return (
          <View style={styles.activityContainer}>
            <FlatList
              data={RECENT_TRANSACTIONS}
              keyExtractor={(item) => item.id}
              renderItem={renderTransactionItem}
              scrollEnabled={false}
              contentContainerStyle={styles.transactionsList}
            />
          </View>
        )
      default:
        return null
    }
  }

  const renderWalletContent = () => {
    if (!isWalletConnected) {
      return (
        <View style={styles.connectWalletContainer}>
          <LinearGradient colors={["rgba(255,61,255,0.1)", "rgba(93,0,255,0.1)"]} style={styles.connectWalletCard}>
            <Icon name="wallet-outline" size={50} color="#FF3DFF" />
            <Text style={styles.connectWalletTitle}>Connect Your Wallet</Text>
            <Text style={styles.connectWalletDescription}>
              Connect your wallet to view your assets, NFTs, and transaction history
            </Text>
            <TouchableOpacity style={styles.connectWalletButton} onPress={() => setIsWalletConnected(true)}>
              <LinearGradient
                colors={["#FF3DFF", "#5D00FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.connectWalletButtonGradient}
              >
                <Text style={styles.connectWalletButtonText}>Connect Wallet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )
    }

    return (
      <>
        {/* Balance Card */}
        <Animated.View style={[styles.balanceContainer, balanceStyle]}>
          <View
            style={styles.balanceCard}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
          >
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <MaskedView maskElement={<Text style={styles.balanceAmount}>$7,521.09</Text>}>
              <LinearGradient
                colors={["#FF3DFF", "#5D00FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
            <View style={styles.walletAddressContainer}>
              <Text style={styles.walletAddressLabel}>Wallet Address</Text>
              <View style={styles.walletAddress}>
                <Text style={styles.walletAddressText}>0x1a2b...3c4d</Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Icon name="copy-outline" size={16} color="#FF3DFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsContainer, actionsStyle]}>
          <TouchableOpacity style={styles.actionButton}>
            <View
              style={styles.actionButtonInner}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="arrow-down-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Receive</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View
              style={styles.actionButtonInner}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="arrow-up-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Send</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View
              style={styles.actionButtonInner}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="swap-horizontal-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Swap</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View
              style={styles.actionButtonInner}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="card-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Buy</Text>
            </View>
          </TouchableOpacity>
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
      </>
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
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Wallet</Text>
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
        {renderWalletContent()}
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
  connectWalletContainer: {
    padding: 20,
  },
  connectWalletCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  connectWalletTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  connectWalletDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 30,
  },
  connectWalletButton: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  connectWalletButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  connectWalletButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  walletAddressContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  walletAddressLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 5,
  },
  walletAddress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletAddressText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  copyButton: {
    padding: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  actionButtonInner: {
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actionButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
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
  assetsContainer: {
    marginBottom: 20,
  },
  assetsList: {},
  assetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  assetName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  assetBalance: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  assetRight: {
    alignItems: "flex-end",
  },
  assetValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  assetChange: {
    fontSize: 14,
  },
  positiveChange: {
    color: "#00FFB3",
  },
  negativeChange: {
    color: "#FF3DFF",
  },
  nftsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
  },
  activityContainer: {
    marginBottom: 20,
  },
  transactionsList: {},
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  transactionDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  transactionDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
