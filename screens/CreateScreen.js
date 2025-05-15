"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import { BlurView } from "@react-native-community/blur"
import Icon from "react-native-vector-icons/Ionicons"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

export default function CreateScreen() {
  const insets = useSafeAreaInsets()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [royalty, setRoyalty] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Animation values
  const headerTranslateY = useSharedValue(-50)
  const headerOpacity = useSharedValue(0)
  const contentTranslateY = useSharedValue(100)
  const contentOpacity = useSharedValue(0)
  const buttonScale = useSharedValue(0.8)
  const buttonOpacity = useSharedValue(0)

  // Step indicators animation values
  const step1Scale = useSharedValue(1)
  const step2Scale = useSharedValue(0.8)
  const step3Scale = useSharedValue(0.8)
  const step1Opacity = useSharedValue(1)
  const step2Opacity = useSharedValue(0.5)
  const step3Opacity = useSharedValue(0.5)

  useEffect(() => {
    // Animate header
    headerTranslateY.value = withTiming(0, { duration: 800 })
    headerOpacity.value = withTiming(1, { duration: 800 })

    // Animate content
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }))
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }))

    // Animate button
    buttonScale.value = withDelay(400, withTiming(1, { duration: 400 }))
    buttonOpacity.value = withDelay(400, withTiming(1, { duration: 400 }))
  }, [])

  // Mock function to simulate image selection
  const selectImage = () => {
    // In a real app, you would use react-native-image-picker
    setSelectedImage("https://picsum.photos/id/237/400/400")
  }

  const goToNextStep = () => {
    if (currentStep < 3) {
      // Animate step indicators
      if (currentStep === 1) {
        step1Scale.value = withTiming(0.8, { duration: 300 })
        step1Opacity.value = withTiming(0.5, { duration: 300 })
        step2Scale.value = withTiming(1, { duration: 300 })
        step2Opacity.value = withTiming(1, { duration: 300 })
      } else if (currentStep === 2) {
        step2Scale.value = withTiming(0.8, { duration: 300 })
        step2Opacity.value = withTiming(0.5, { duration: 300 })
        step3Scale.value = withTiming(1, { duration: 300 })
        step3Opacity.value = withTiming(1, { duration: 300 })
      }

      // Animate content transition
      contentOpacity.value = withTiming(0, { duration: 300 })
      contentTranslateY.value = withTiming(-50, { duration: 300 }, () => {
        runOnJS(setCurrentStep)(currentStep + 1)
        contentTranslateY.value = 50
        contentOpacity.value = withTiming(1, { duration: 300 })
        contentTranslateY.value = withTiming(0, { duration: 300 })
      })
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      // Animate step indicators
      if (currentStep === 2) {
        step2Scale.value = withTiming(0.8, { duration: 300 })
        step2Opacity.value = withTiming(0.5, { duration: 300 })
        step1Scale.value = withTiming(1, { duration: 300 })
        step1Opacity.value = withTiming(1, { duration: 300 })
      } else if (currentStep === 3) {
        step3Scale.value = withTiming(0.8, { duration: 300 })
        step3Opacity.value = withTiming(0.5, { duration: 300 })
        step2Scale.value = withTiming(1, { duration: 300 })
        step2Opacity.value = withTiming(1, { duration: 300 })
      }

      // Animate content transition
      contentOpacity.value = withTiming(0, { duration: 300 })
      contentTranslateY.value = withTiming(50, { duration: 300 }, () => {
        runOnJS(setCurrentStep)(currentStep - 1)
        contentTranslateY.value = -50
        contentOpacity.value = withTiming(1, { duration: 300 })
        contentTranslateY.value = withTiming(0, { duration: 300 })
      })
    }
  }

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

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      opacity: buttonOpacity.value,
    }
  })

  const step1Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: step1Scale.value }],
      opacity: step1Opacity.value,
    }
  })

  const step2Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: step2Scale.value }],
      opacity: step2Opacity.value,
    }
  })

  const step3Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: step3Scale.value }],
      opacity: step3Opacity.value,
    }
  })

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Upload Media</Text>
            <Text style={styles.stepDescription}>Choose the artwork you want to mint as an NFT</Text>

            {selectedImage ? (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.selectedImageGradient} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
                  <View
                    style={styles.removeImageButtonInner}
                    blurType="dark"
                    blurAmount={20}
                    reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
                  >
                    <Icon name="close" size={20} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
                <LinearGradient
                  colors={["rgba(255,61,255,0.1)", "rgba(93,0,255,0.1)"]}
                  style={styles.uploadButtonGradient}
                >
                  <View style={styles.uploadIconContainer}>
                    <LinearGradient colors={["#FF3DFF", "#5D00FF"]} style={styles.uploadIcon}>
                      <Icon name="image-outline" size={30} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.uploadText}>Tap to upload</Text>
                  <Text style={styles.uploadSubtext}>JPG, PNG, GIF, SVG, WEBP. Max 100MB.</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.mediaTypeContainer}>
              <Text style={styles.mediaTypeTitle}>Media Type</Text>
              <View style={styles.mediaTypeButtons}>
                <TouchableOpacity style={[styles.mediaTypeButton, styles.mediaTypeButtonActive]}>
                  <Text style={styles.mediaTypeButtonText}>Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaTypeButton}>
                  <Text style={styles.mediaTypeButtonText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaTypeButton}>
                  <Text style={styles.mediaTypeButtonText}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaTypeButton}>
                  <Text style={styles.mediaTypeButtonText}>3D</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>NFT Details</Text>
            <Text style={styles.stepDescription}>Add information about your NFT</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <View
                style={styles.inputContainer}
                blurType="dark"
                blurAmount={20}
                reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter NFT name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <View
                style={[styles.inputContainer, styles.textAreaContainer]}
                blurType="dark"
                blurAmount={20}
                reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
              >
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Provide a detailed description of your NFT"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price</Text>
                <View
                  style={styles.inputContainer}
                  blurType="dark"
                  blurAmount={20}
                  reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
                >
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.inputSuffix}>ETH</Text>
                </View>
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Royalty %</Text>
                <View
                  style={styles.inputContainer}
                  blurType="dark"
                  blurAmount={20}
                  reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
                >
                  <TextInput
                    style={styles.input}
                    placeholder="0-10"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={royalty}
                    onChangeText={setRoyalty}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.inputSuffix}>%</Text>
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Collection</Text>
              <TouchableOpacity>
                <View
                  style={styles.collectionSelector}
                  blurType="dark"
                  blurAmount={20}
                  reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
                >
                  <Text style={styles.collectionText}>Select Collection</Text>
                  <Icon name="chevron-down" size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Preview & Mint</Text>
            <Text style={styles.stepDescription}>Review your NFT before minting</Text>

            <View style={styles.previewCard}>
              <View style={styles.previewImageContainer}>
                <Image
                  source={{ uri: selectedImage || "https://picsum.photos/id/237/400/400" }}
                  style={styles.previewImage}
                />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.previewImageGradient} />
              </View>

              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>{name || "Untitled NFT"}</Text>
                <View style={styles.previewCreator}>
                  <Image source={{ uri: "https://picsum.photos/id/64/100/100" }} style={styles.previewCreatorImage} />
                  <Text style={styles.previewCreatorText}>
                    by <Text style={styles.previewCreatorName}>You</Text>
                  </Text>
                </View>

                <Text style={styles.previewDescription}>{description || "No description provided"}</Text>

                <View style={styles.previewDetails}>
                  <View style={styles.previewDetailItem}>
                    <Text style={styles.previewDetailLabel}>Price</Text>
                    <Text style={styles.previewDetailValue}>{price || "0.00"} ETH</Text>
                  </View>

                  <View style={styles.previewDetailItem}>
                    <Text style={styles.previewDetailLabel}>Royalty</Text>
                    <Text style={styles.previewDetailValue}>{royalty || "0"}%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.mintInfoContainer}>
              <View style={styles.mintInfoItem}>
                <Icon name="information-circle-outline" size={20} color="#FF3DFF" />
                <Text style={styles.mintInfoText}>Gas fees will apply when minting your NFT</Text>
              </View>
              <View style={styles.mintInfoItem}>
                <Icon name="shield-checkmark-outline" size={20} color="#FF3DFF" />
                <Text style={styles.mintInfoText}>Your NFT will be stored on the Ethereum blockchain</Text>
              </View>
            </View>
          </View>
        )
      default:
        return null
    }
  }

  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedImage) return true
    if (currentStep === 2 && (!name || !price)) return true
    return false
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#0A0A12", "#1A103D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <TouchableOpacity style={styles.backButton} onPress={goToPreviousStep} disabled={currentStep === 1}>
            <View
              style={[styles.backButtonInner, currentStep === 1 && { opacity: 0.5 }]}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.8)"
            >
              <Icon name="arrow-back" size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.stepIndicator}>
            <Animated.View style={[styles.stepDot, step1Style]}>
              {currentStep > 1 ? (
                <Icon name="checkmark" size={12} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepNumber}>1</Text>
              )}
            </Animated.View>
            <View style={styles.stepLine} />
            <Animated.View style={[styles.stepDot, step2Style]}>
              {currentStep > 2 ? (
                <Icon name="checkmark" size={12} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepNumber}>2</Text>
              )}
            </Animated.View>
            <View style={styles.stepLine} />
            <Animated.View style={[styles.stepDot, step3Style]}>
              <Text style={styles.stepNumber}>3</Text>
            </Animated.View>
          </View>

          <View style={{ width: 40 }} />
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={contentStyle}>{renderStepContent()}</Animated.View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={[styles.actionContainer, { paddingBottom: insets.bottom || 16 }]}>
          <View
            style={styles.actionContainerInner}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="rgba(10, 10, 18, 0.95)"
          >
            {currentStep < 3 ? (
              <Animated.View style={[styles.actionButton, buttonStyle]}>
                <TouchableOpacity
                  style={[styles.actionButtonInner, isNextDisabled() && styles.actionButtonDisabled]}
                  onPress={goToNextStep}
                  disabled={isNextDisabled()}
                >
                  <LinearGradient
                    colors={["#FF3DFF", "#5D00FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionButtonGradient}
                  >
                    <Text style={styles.actionButtonText}>Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View style={[styles.actionButton, buttonStyle]}>
                <TouchableOpacity style={styles.actionButtonInner}>
                  <LinearGradient
                    colors={["#FF3DFF", "#5D00FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionButtonGradient}
                  >
                    <Text style={styles.actionButtonText}>Mint NFT</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  stepLine: {
    width: 20,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
  },
  selectedImageContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  selectedImage: {
    width: "100%",
    height: 300,
    borderRadius: 20,
  },
  selectedImageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  removeImageButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  uploadButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  uploadButtonGradient: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
    borderRadius: 20,
  },
  uploadIconContainer: {
    marginBottom: 15,
    borderRadius: 30,
    overflow: "hidden",
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  mediaTypeContainer: {
    marginBottom: 20,
  },
  mediaTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  mediaTypeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mediaTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mediaTypeButtonActive: {
    backgroundColor: "rgba(255,61,255,0.2)",
    borderColor: "#FF3DFF",
  },
  mediaTypeButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputSuffix: {
    paddingRight: 15,
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  textAreaContainer: {
    height: 120,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  collectionSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  collectionText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
  },
  previewCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  previewImageContainer: {
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 250,
  },
  previewImageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  previewContent: {
    padding: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  previewCreator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  previewCreatorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  previewCreatorText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  previewCreatorName: {
    color: "#FF3DFF",
  },
  previewDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 15,
    lineHeight: 20,
  },
  previewDetails: {
    flexDirection: "row",
  },
  previewDetailItem: {
    marginRight: 30,
  },
  previewDetailLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 5,
  },
  previewDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  mintInfoContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mintInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  mintInfoText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 10,
    flex: 1,
  },
  actionContainer: {
    bottom:30,
    left: 0,
    right: 0,
    padding: 20,
  },
  actionContainerInner: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 10,
  },
  actionButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  actionButtonInner: {
    borderRadius: 15,
    overflow: "hidden",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})
