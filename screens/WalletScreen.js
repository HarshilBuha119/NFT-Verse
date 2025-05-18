"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Clipboard,
  Alert,
  Animated as RNAnimated,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaskedView from "@react-native-masked-view/masked-view"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated"
import QRCode from "react-native-qrcode-svg"
import Slider from "@react-native-community/slider"

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
    icon: "https://img.icons8.com/fluent/512/ethereum.png",
  },
  {
    id: "2",
    name: "USD Coin",
    symbol: "USDC",
    balance: "1,250.00",
    value: "$1,250.00",
    change: "0.0%",
    positive: true,
    icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/vectors/usdc-fpxuadmgafrjjy85bgie5.png/usdc-kksfxcrdl3f9pjx0v6jxxp.png?_a=DATAdtAAZAA0",
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    balance: "15.8",
    value: "$1,738.42",
    change: "-2.1%",
    positive: false,
    icon: "https://i.pinimg.com/736x/bd/f5/06/bdf5066589b7865a55d6790c210dba6d.jpg",
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

// Exchange rates for swap
const EXCHANGE_RATES = {
  ETH: {
    USDC: 1850,
    SOL: 16.8,
  },
  USDC: {
    ETH: 0.00054,
    SOL: 0.0091,
  },
  SOL: {
    ETH: 0.059,
    USDC: 110,
  },
}

// Payment methods for buy
const PAYMENT_METHODS = [
  {
    id: "1",
    name: "Credit Card",
    icon: "card-outline",
    description: "Visa, Mastercard, etc.",
  },
  {
    id: "2",
    name: "Bank Transfer",
    icon: "business-outline",
    description: "ACH, Wire Transfer",
  },
  {
    id: "3",
    name: "Apple Pay",
    icon: "logo-apple",
    description: "Quick and secure",
  },
]

export default function WalletScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState("Assets")
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [balance, setBalance] = useState(0);

  // Modal states
  const [receiveModalVisible, setReceiveModalVisible] = useState(false)
  const [sendModalVisible, setSendModalVisible] = useState(false)
  const [swapModalVisible, setSwapModalVisible] = useState(false)
  const [buyModalVisible, setBuyModalVisible] = useState(false)

  // Send form state
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState(WALLET_ASSETS[0])
  const [sendGasOption, setSendGasOption] = useState("standard") // standard, fast, rapid

  // Swap form state
  const [fromAsset, setFromAsset] = useState(WALLET_ASSETS[0])
  const [toAsset, setToAsset] = useState(WALLET_ASSETS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5) // Default 0.5%

  // Buy form state
  const [buyAmount, setBuyAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0])

  // Animation for modals
  const modalAnimation = useRef(new RNAnimated.Value(0)).current

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

  // Calculate swap rate
  useEffect(() => {
    if (fromAmount && fromAsset && toAsset) {
      const rate = EXCHANGE_RATES[fromAsset.symbol][toAsset.symbol]
      const calculatedAmount = (Number.parseFloat(fromAmount) * rate).toFixed(6)
      setToAmount(calculatedAmount)
    }
  }, [fromAmount, fromAsset, toAsset])

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

  // Copy wallet address to clipboard
  const copyToClipboard = (text) => {
    Clipboard.setString(text)
    Alert.alert("Copied", "Address copied to clipboard")
  }

  // Handle send transaction
  const handleSendTransaction = () => {
    if (!sendAddress || !sendAmount) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    // Simulate transaction processing
    Alert.alert("Confirm Transaction", `Send ${sendAmount} ${selectedAsset.symbol} to ${sendAddress}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          // Simulate transaction processing
          setTimeout(() => {
            Alert.alert("Success", `${sendAmount} ${selectedAsset.symbol} sent successfully!`)
            setSendModalVisible(false)
            setSendAddress("")
            setSendAmount("")
          }, 2000)
        },
      },
    ])
  }

  // Handle swap transaction
  const handleSwapTransaction = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount")
      return
    }

    // Simulate transaction processing
    Alert.alert(
      "Confirm Swap",
      `Swap ${fromAmount} ${fromAsset.symbol} for approximately ${toAmount} ${toAsset.symbol}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            // Simulate transaction processing
            setTimeout(() => {
              Alert.alert("Success", `Swap completed successfully!`)
              setSwapModalVisible(false)
              setFromAmount("")
              setToAmount("")
            }, 2000)
          },
        },
      ],
    )
  }

  // Handle buy transaction
  const handleBuyTransaction = () => {
    if (!buyAmount || Number.parseFloat(buyAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount")
      return
    }

    // Simulate transaction processing
    Alert.alert("Confirm Purchase", `Buy ${buyAmount} ETH using ${selectedPaymentMethod.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          // Simulate transaction processing
          setTimeout(() => {
            Alert.alert("Success", `Purchase completed successfully!`)
            setBuyModalVisible(false)
            setBuyAmount("")
          }, 2000)
        },
      },
    ])
  }

  // Swap assets
  const swapAssets = () => {
    const temp = fromAsset
    setFromAsset(toAsset)
    setToAsset(temp)
    setFromAmount("")
    setToAmount("")
  }

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
  
    useEffect(() => {
    const randomBalance = Math.floor(Math.random() * 50000);
    setBalance(randomBalance); // ✅ Updates state and re-renders component
  }, []);
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
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
          >
            <View style={styles.balance}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>${balance}</Text>
            </View>
            <LinearGradient
              colors={["#FF3DFF", "#5D00FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
            <View style={styles.walletAddressContainer}>
              <Text style={styles.walletAddressLabel}>Wallet Address</Text>
              <View style={styles.walletAddress}>
                <Text style={styles.walletAddressText}>0x1a2b...3c4d</Text>
                <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard("0x1a2b3c4d5e6f7g8h9i0j")}>
                  <Icon name="copy-outline" size={16} color="#FF3DFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsContainer, actionsStyle]}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setReceiveModalVisible(true)}>
            <View
              style={styles.actionButtonInner}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="arrow-down-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Receive</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setSendModalVisible(true)}>
            <View
              style={styles.actionButtonInner}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="arrow-up-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Send</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setSwapModalVisible(true)}>
            <View
              style={styles.actionButtonInner}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <LinearGradient colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]} style={styles.actionButtonIcon}>
                <Icon name="swap-horizontal-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Swap</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setBuyModalVisible(true)}>
            <View
              style={styles.actionButtonInner}
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

  // Render Receive Modal
  const renderReceiveModal = () => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={receiveModalVisible}
    onRequestClose={() => setReceiveModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalBlur}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Receive Crypto</Text>
            <TouchableOpacity onPress={() => setReceiveModalVisible(false)}>
              <Icon name="close-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Select Asset */}
          <View style={styles.sendAssetSelector}>
            <Text style={styles.sendLabel}>Select Asset</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetScroll}>
              {WALLET_ASSETS.map((asset) => (
                <TouchableOpacity
                  key={asset.id}
                  style={[styles.assetOption, selectedAsset.id === asset.id && styles.assetOptionSelected]}
                  onPress={() => setSelectedAsset(asset)}
                >
                  <Image source={{ uri: asset.icon }} style={styles.assetOptionIcon} />
                  <Text style={styles.assetOptionText}>{asset.symbol}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recipient Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Wallet Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={sendAddress}
                editable={false}
                placeholderTextColor="rgba(255,255,255,0.5)"
                placeholder="0x1a2b3c4d5e6f7g8h9i0j"
              />
              <TouchableOpacity onPress={() => Alert.alert("Copied", "Wallet address copied!")}>
                <Icon name="copy-outline" size={20} color="#FF3DFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);


  // Render Send Modal
  const renderSendModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={sendModalVisible}
      onRequestClose={() => setSendModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBlur} >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Crypto</Text>
              <TouchableOpacity onPress={() => setSendModalVisible(false)}>
                <Icon name="close-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.sendAssetSelector}>
              <Text style={styles.sendLabel}>Select Asset</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetScroll}>
                {WALLET_ASSETS.map((asset) => (
                  <TouchableOpacity
                    key={asset.id}
                    style={[styles.assetOption, selectedAsset.id === asset.id && styles.assetOptionSelected]}
                    onPress={() => setSelectedAsset(asset)}
                  >
                    <Image source={{ uri: asset.icon }} style={styles.assetOptionIcon} />
                    <Text style={styles.assetOptionText}>{asset.symbol}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter wallet address"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={sendAddress}
                  onChangeText={setSendAddress}
                />
                <TouchableOpacity onPress={() => Alert.alert("Scan", "QR scanning would go here")}>
                  <Icon name="scan-outline" size={20} color="#FF3DFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter amount in ${selectedAsset.symbol}`}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={sendAmount}
                  onChangeText={setSendAmount}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity onPress={() => setSendAmount(selectedAsset.balance)}>
                  <Text style={styles.maxButton}>MAX</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceText}>
                Available: {selectedAsset.balance} {selectedAsset.symbol}
              </Text>
            </View>

            <View style={styles.gasOptions}>
              <Text style={styles.gasTitle}>Transaction Speed</Text>
              <View style={styles.gasSelector}>
                <TouchableOpacity
                  style={[styles.gasOption, sendGasOption === "standard" && styles.gasOptionSelected]}
                  onPress={() => setSendGasOption("standard")}
                >
                  <Text style={styles.gasOptionText}>Standard</Text>
                  <Text style={styles.gasPrice}>~2 min</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.gasOption, sendGasOption === "fast" && styles.gasOptionSelected]}
                  onPress={() => setSendGasOption("fast")}
                >
                  <Text style={styles.gasOptionText}>Fast</Text>
                  <Text style={styles.gasPrice}>~30 sec</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.gasOption, sendGasOption === "rapid" && styles.gasOptionSelected]}
                  onPress={() => setSendGasOption("rapid")}
                >
                  <Text style={styles.gasOptionText}>Rapid</Text>
                  <Text style={styles.gasPrice}>~10 sec</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.sendButton, (!sendAddress || !sendAmount) && styles.sendButtonDisabled]}
              onPress={handleSendTransaction}
              disabled={!sendAddress || !sendAmount}
            >
              <LinearGradient
                colors={["#FF3DFF", "#5D00FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>Send {selectedAsset.symbol}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  // Render Swap Modal
  const renderSwapModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={swapModalVisible}
      onRequestClose={() => setSwapModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBlur} >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Swap Crypto</Text>
              <TouchableOpacity onPress={() => setSwapModalVisible(false)}>
                <Icon name="close-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.swapContainer}>
              {/* From Asset */}
              <View style={styles.swapBox}>
                <View style={styles.swapBoxHeader}>
                  <Text style={styles.swapLabel}>From</Text>
                  <Text style={styles.swapBalance}>
                    Balance: {fromAsset.balance} {fromAsset.symbol}
                  </Text>
                </View>
                <View style={styles.swapInputContainer}>
                  <TextInput
                    style={styles.swapInput}
                    placeholder="0.0"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={fromAmount}
                    onChangeText={setFromAmount}
                    keyboardType="decimal-pad"
                  />
                  <TouchableOpacity
                    style={styles.swapAssetSelector}
                    onPress={() => Alert.alert("Select", "Asset selection would go here")}
                  >
                    <Image source={{ uri: fromAsset.icon }} style={styles.swapAssetIcon} />
                    <Text style={styles.swapAssetText}>{fromAsset.symbol}</Text>
                    <Icon name="chevron-down" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Swap Button */}
              <TouchableOpacity style={styles.swapDirectionButton} onPress={swapAssets}>
                <LinearGradient
                  colors={["rgba(255,61,255,0.2)", "rgba(93,0,255,0.2)"]}
                  style={styles.swapDirectionButtonInner}
                >
                  <Icon name="swap-vertical" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              {/* To Asset */}
              <View style={styles.swapBox}>
                <View style={styles.swapBoxHeader}>
                  <Text style={styles.swapLabel}>To (Estimated)</Text>
                </View>
                <View style={styles.swapInputContainer}>
                  <TextInput
                    style={styles.swapInput}
                    placeholder="0.0"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={toAmount}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.swapAssetSelector}
                    onPress={() => Alert.alert("Select", "Asset selection would go here")}
                  >
                    <Image source={{ uri: toAsset.icon }} style={styles.swapAssetIcon} />
                    <Text style={styles.swapAssetText}>{toAsset.symbol}</Text>
                    <Icon name="chevron-down" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Exchange Rate */}
            <View style={styles.exchangeRate}>
              <Text style={styles.exchangeRateText}>
                1 {fromAsset.symbol} ≈ {EXCHANGE_RATES[fromAsset.symbol][toAsset.symbol]} {toAsset.symbol}
              </Text>
            </View>

            {/* Slippage Settings */}
            <View style={styles.slippageContainer}>
              <View style={styles.slippageHeader}>
                <Text style={styles.slippageTitle}>Slippage Tolerance</Text>
                <Text style={styles.slippageValue}>{slippage}%</Text>
              </View>
              <Slider
                style={styles.slippageSlider}
                minimumValue={0.1}
                maximumValue={5}
                step={0.1}
                value={slippage}
                onValueChange={setSlippage}
                minimumTrackTintColor="#FF3DFF"
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor="#FF3DFF"
              />
              <View style={styles.slippageLabels}>
                <Text style={styles.slippageLabel}>0.1%</Text>
                <Text style={styles.slippageLabel}>5%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.swapButton,
                (!fromAmount || Number.parseFloat(fromAmount) <= 0) && styles.swapButtonDisabled,
              ]}
              onPress={handleSwapTransaction}
              disabled={!fromAmount || Number.parseFloat(fromAmount) <= 0}
            >
              <LinearGradient
                colors={["#FF3DFF", "#5D00FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.swapButtonGradient}
              >
                <Text style={styles.swapButtonText}>Swap</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  // Render Buy Modal
  const renderBuyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={buyModalVisible}
      onRequestClose={() => setBuyModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBlur} >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buy Crypto</Text>
              <TouchableOpacity onPress={() => setBuyModalVisible(false)}>
                <Icon name="close-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.buyAmountContainer}>
              <Text style={styles.buyLabel}>Amount to Buy</Text>
              <View style={styles.buyInputContainer}>
                <TextInput
                  style={styles.buyInput}
                  placeholder="0.0"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={buyAmount}
                  onChangeText={setBuyAmount}
                  keyboardType="decimal-pad"
                />
                <View style={styles.buyAssetSelector}>
                  <Image source={{ uri: WALLET_ASSETS[0].icon }} style={styles.buyAssetIcon} />
                  <Text style={styles.buyAssetText}>ETH</Text>
                </View>
              </View>
              <Text style={styles.buyEquivalent}>
                ≈ ${buyAmount ? (Number.parseFloat(buyAmount) * 1850).toFixed(2) : "0.00"}
              </Text>
            </View>

            <View style={styles.quickAmounts}>
              <TouchableOpacity style={styles.quickAmount} onPress={() => setBuyAmount("0.1")}>
                <Text style={styles.quickAmountText}>$185</Text>
                <Text style={styles.quickAmountSubtext}>0.1 ETH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAmount} onPress={() => setBuyAmount("0.5")}>
                <Text style={styles.quickAmountText}>$925</Text>
                <Text style={styles.quickAmountSubtext}>0.5 ETH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAmount} onPress={() => setBuyAmount("1")}>
                <Text style={styles.quickAmountText}>$1,850</Text>
                <Text style={styles.quickAmountSubtext}>1 ETH</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentMethodTitle}>Payment Method</Text>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentMethod, selectedPaymentMethod.id === method.id && styles.paymentMethodSelected]}
                  onPress={() => setSelectedPaymentMethod(method)}
                >
                  <View style={styles.paymentMethodLeft}>
                    <View style={styles.paymentMethodIcon}>
                      <Icon name={method.icon} size={20} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentMethodRadio}>
                    {selectedPaymentMethod.id === method.id && <View style={styles.paymentMethodRadioSelected} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.buyButton, (!buyAmount || Number.parseFloat(buyAmount) <= 0) && styles.buyButtonDisabled]}
              onPress={handleBuyTransaction}
              disabled={!buyAmount || Number.parseFloat(buyAmount) <= 0}
            >
              <LinearGradient
                colors={["#FF3DFF", "#5D00FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buyButtonGradient}
              >
                <Text style={styles.buyButtonText}>Buy ETH</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

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
        <Text style={styles.headerTitle}>Wallet</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderWalletContent()}
      </ScrollView>

      {/* Modals */}
      {renderReceiveModal()}
      {renderSendModal()}
      {renderSwapModal()}
      {renderBuyModal()}
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  balance: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  balanceLabel: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
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

  // Modal styles
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "flex-end",
},
modalContent: {
  backgroundColor: "#1A103D",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 20,
  minHeight: 300, // Ensure content is visible
},
modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#FFFFFF",
},
addressText: {
  fontSize: 14,
  color: "#FFFFFF",
},

  // Receive Modal
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    marginBottom: 20,
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  addressText: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
  },
  receiveAssetSelector: {
    marginBottom: 20,
  },
  receiveAssetLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  assetScroll: {
    marginBottom: 10,
  },
  assetOption: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  assetOptionSelected: {
    borderColor: "#FF3DFF",
    backgroundColor: "rgba(255,61,255,0.1)",
  },
  assetOptionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 5,
  },
  assetOptionText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  receiveWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255,61,255,0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  receiveWarningText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 10,
    flex: 1,
  },
  shareButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  shareButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Send Modal
  sendAssetSelector: {
    marginBottom: 20,
  },
  sendLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 10,
  },
  maxButton: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF3DFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF3DFF",
  },
  balanceText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 5,
  },
  gasOptions: {
    marginBottom: 20,
  },
  gasTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  gasSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gasOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  gasOptionSelected: {
    borderColor: "#FF3DFF",
    backgroundColor: "rgba(255,61,255,0.1)",
  },
  gasOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  gasPrice: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  sendButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Swap Modal
  swapContainer: {
    marginBottom: 20,
  },
  swapBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
  },
  swapBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  swapLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  swapBalance: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  swapInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  swapInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  swapAssetSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 8,
  },
  swapAssetIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  swapAssetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 8,
  },
  swapDirectionButton: {
    alignSelf: "center",
    marginVertical: -15,
    zIndex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  swapDirectionButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  exchangeRate: {
    alignItems: "center",
    marginBottom: 20,
  },
  exchangeRateText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  slippageContainer: {
    marginBottom: 20,
  },
  slippageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  slippageTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  slippageValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  slippageSlider: {
    width: "100%",
    height: 40,
  },
  slippageLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slippageLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  swapButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  swapButtonDisabled: {
    opacity: 0.5,
  },
  swapButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  swapButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Buy Modal
  buyAmountContainer: {
    marginBottom: 20,
  },
  buyLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  buyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  buyInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  buyAssetSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 8,
  },
  buyAssetIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  buyAssetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  buyEquivalent: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 10,
    textAlign: "right",
  },
  quickAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickAmount: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  quickAmountSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethodTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
  },
  paymentMethodSelected: {
    borderColor: "#FF3DFF",
    backgroundColor: "rgba(255,61,255,0.1)",
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  paymentMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF3DFF",
  },
  buyButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})
