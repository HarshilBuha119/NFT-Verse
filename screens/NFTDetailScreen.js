import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const HEADER_HEIGHT = 350;

export default function NFTDetailScreen({route, navigation}) {
  const {nft} = route.params;
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const imageTranslateY = useSharedValue(0);
  const contentTranslateY = useSharedValue(100);
  const contentOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const likeScale = useSharedValue(1);

  // Animation for bid button
  const bidButtonScale = useSharedValue(0.8);
  const bidButtonOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate content
    contentTranslateY.value = withTiming(0, {duration: 800});
    contentOpacity.value = withTiming(1, {duration: 800});

    // Animate header
    headerOpacity.value = withTiming(1, {duration: 600});

    // Animate bid button
    bidButtonScale.value = withDelay(600, withTiming(1, {duration: 400}));
    bidButtonOpacity.value = withDelay(600, withTiming(1, {duration: 400}));
  }, []);

  // Handle like button press
  const handleLikePress = () => {
    setLiked(!liked);
    likeScale.value = withSequence(
      withTiming(1.3, {duration: 200}),
      withTiming(1, {duration: 200}),
    );
  };

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;

      // Parallax effect for image
      imageTranslateY.value = event.contentOffset.y * 0.5;
      imageScale.value = interpolate(
        event.contentOffset.y,
        [-100, 0],
        [1.2, 1],
        Extrapolate.CLAMP,
      );
    },
  });

  // Animated styles
  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: imageTranslateY.value},
        {scale: imageScale.value},
      ],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: contentTranslateY.value}],
      opacity: contentOpacity.value,
    };
  });

  const navTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT / 2, HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {opacity};
  });

  const likeButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: likeScale.value}],
    };
  });

  const bidButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: bidButtonScale.value}],
      opacity: bidButtonOpacity.value,
    };
  });

  const price=Math.floor(Math.random() * 5000)

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <LinearGradient
        colors={['#0A0A12', '#1A103D']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.background}
      />

      {/* Animated Header Image */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Image
          source={{uri: nft.image}}
          style={[styles.headerImage, imageStyle]}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(10,10,18,1)']}
          style={styles.headerGradient}
        />
      </Animated.View>

      {/* Navigation Bar */}
      <View style={[styles.navbar, {paddingTop: insets.top}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View
            style={styles.backButtonInner}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)">
            <Icon name="arrow-back" size={22} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Animated.View style={[styles.navTitle, navTitleStyle]}>
          <Text style={styles.navTitleText} numberOfLines={1}>
            {nft.name}
          </Text>
        </Animated.View>

        <TouchableOpacity style={styles.shareButton}>
          <View
            style={styles.shareButtonInner}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)">
            <Icon name="share-outline" size={22} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        {/* Spacer for header */}
        <View style={{height: HEADER_HEIGHT}} />

        {/* Content Card */}
        <Animated.View style={[styles.contentCard, contentStyle]}>
          <View
            style={styles.contentCardInner}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.95)">
            {/* NFT Info */}
            <View style={styles.nftInfo}>
              <View>
                <Text style={styles.nftName}>{nft.name}</Text>
                <View style={styles.creatorContainer}>
                  <Image
                    source={{uri: `https://picsum.photos/id/64/100/100`}}
                    style={styles.creatorAvatar}
                  />
                  <Text style={styles.creatorText}>
                    Created by{' '}
                    <Text style={styles.creatorName}>{nft.creator}</Text>
                  </Text>
                </View>
              </View>
              <Animated.View style={likeButtonStyle}>
                <TouchableOpacity
                  style={[styles.likeButton, liked && styles.likedButton]}
                  onPress={handleLikePress}>
                  <Icon
                    name={liked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={liked ? '#FFFFFF' : '#FF3DFF'}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Current Bid */}
            <View style={styles.bidContainer}>
              <LinearGradient
                colors={['rgba(255,61,255,0.1)', 'rgba(93,0,255,0.1)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.bidGradient}>
                <View style={styles.bidInfo}>
                  <View>
                    <Text style={styles.bidLabel}>Current Price</Text>
                    <MaskedView
                      maskElement={
                        <Text style={styles.bidPrice}>{nft.price}</Text>
                      }>
                      <LinearGradient
                        colors={['#FF3DFF', '#5D00FF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={{flex: 1}}
                      />
                    </MaskedView>
                    <Text style={styles.fiatPrice}>≈ ${price}</Text>
                  </View>
                  <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Auction ending in</Text>
                    <View style={styles.timer}>
                      <View style={styles.timeUnit}>
                        <Text style={styles.timeValue}>12</Text>
                        <Text style={styles.timeLabel}>hours</Text>
                      </View>
                      <Text style={styles.timeSeparator}>:</Text>
                      <View style={styles.timeUnit}>
                        <Text style={styles.timeValue}>30</Text>
                        <Text style={styles.timeLabel}>mins</Text>
                      </View>
                      <Text style={styles.timeSeparator}>:</Text>
                      <View style={styles.timeUnit}>
                        <Text style={styles.timeValue}>45</Text>
                        <Text style={styles.timeLabel}>secs</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Animated.View style={bidButtonStyle}>
                  <TouchableOpacity style={styles.bidButton}>
                    <LinearGradient
                      colors={['#FF3DFF', '#5D00FF']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.bidButtonGradient}>
                      <Text style={styles.bidButtonText}>Place a Bid</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </LinearGradient>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 3}>
                This unique NFT is part of a limited collection showcasing
                digital art at its finest. The piece represents the intersection
                of technology and creativity in the blockchain era. The artist
                spent months perfecting every detail of this piece, drawing
                inspiration from both classical art movements and futuristic
                digital aesthetics. Each element has been carefully crafted to
                create a harmonious yet provocative visual experience.
              </Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => setShowFullDescription(!showFullDescription)}>
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Contract Address</Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.detailValue}>0x1a2b...3c4d</Text>
                    <TouchableOpacity style={styles.copyButton}>
                      <Icon name="copy-outline" size={16} color="#FF3DFF" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Token ID</Text>
                  <Text style={styles.detailValue}>#12345</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Token Standard</Text>
                  <Text style={styles.detailValue}>ERC-721</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Blockchain</Text>
                  <Text style={styles.detailValue}>Ethereum</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Creator Royalties</Text>
                  <Text style={styles.detailValue}>7.5%</Text>
                </View>
              </View>
            </View>

            {/* Transaction History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              {[1, 2, 3].map(item => (
                <View key={item} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <Image
                      source={{
                        uri: `https://picsum.photos/id/${30 + item}/100/100`,
                      }}
                      style={styles.transactionAvatar}
                    />
                    <View>
                      <Text style={styles.transactionType}>
                        {item === 1
                          ? 'Listed by'
                          : item === 2
                          ? 'Bid placed by'
                          : 'Created by'}
                      </Text>
                      <Text style={styles.transactionUser}>User{item}</Text>
                      <Text style={styles.transactionTime}>
                        {item === 1
                          ? '2 hours ago'
                          : item === 2
                          ? '5 hours ago'
                          : '2 days ago'}
                      </Text>
                    </View>
                  </View>
                  {(item === 1 || item === 2) && (
                    <MaskedView
                      maskElement={
                        <Text style={styles.transactionPrice}>
                          {item === 1 ? '0.45 ETH' : '0.40 ETH'}
                        </Text>
                      }>
                      <LinearGradient
                        colors={['#FF3DFF', '#5D00FF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={{flex: 1}}
                      />
                    </MaskedView>
                  )}
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom Action Buttons */}
      <View
        style={[styles.actionContainer, {paddingBottom: insets.bottom || 16}]}>
        <View style={styles.actionContainerInner}>
          <TouchableOpacity style={styles.actionButtonOutline}>
            <Icon name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonOutlineText}>Make Offer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#FF3DFF', '#5D00FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.actionButtonGradient}>
              <Text style={styles.actionButtonText}>Buy Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 2,
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  navTitle: {
    flex: 1,
    alignItems: 'center',
  },
  navTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shareButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  shareButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  contentCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    marginTop: -30,
  },
  contentCardInner: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 0,
  },
  nftInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  nftName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  creatorName: {
    color: '#FF3DFF',
    fontWeight: '500',
  },
  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,61,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,61,255,0.3)',
  },
  likedButton: {
    backgroundColor: '#FF3DFF',
  },
  bidContainer: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bidGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bidLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
  },
  bidPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  fiatPrice: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  timeSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 5,
    marginBottom: 2,
  },
  bidButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  bidButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.7)',
  },
  readMoreButton: {
    marginTop: 10,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF3DFF',
  },
  detailsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    marginLeft: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  transactionType: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  transactionUser: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  transactionTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  transactionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor:"black"
  },
  actionContainerInner: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 15,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionButtonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
