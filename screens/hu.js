const renderReceiveModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={receiveModalVisible}
      onRequestClose={() => setReceiveModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBlur} >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Crypto</Text>
              <TouchableOpacity onPress={() => setReceiveModalVisible(false)}>
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
