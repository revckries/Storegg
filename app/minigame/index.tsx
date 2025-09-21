import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useBalance } from "../../app-example/components/BalanceContext";

const prizes = [
  { value: 100, name: "gold coin", image: require("../../assets/images/gold-coin.png") },
  { value: 50, name: "silver coin", image: require("../../assets/images/silver-coin.png") },
  { value: 20, name: "bronze coin", image: require("../../assets/images/bronze-coin.png") },
];

export default function Minigame() {
  const { balance, setBalance, tokensLeft, setTokensLeft } = useBalance();
  const [isCracking, setIsCracking] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<{ value: number; name: string; image: any } | null>(null);
  const [showBrokenEgg, setShowBrokenEgg] = useState(false);
  const router = useRouter();

  const topAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;

  const handleCrack = () => {
    if (tokensLeft <= 0) {
      Alert.alert("No Tokens Left", "You don't have any tokens left to play the game.");
      return;
    }

    setIsCracking(true);
    setTokensLeft((prev) => prev - 1);

    Animated.parallel([
      Animated.timing(topAnim, {
        toValue: -50,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim, {
        toValue: 50,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setCurrentPrize(randomPrize);
      setBalance((prev) => prev + randomPrize.value); 

      Animated.timing(coinAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowBrokenEgg(true);
    });
  };

  const resetGame = () => {
    setIsCracking(false);
    setCurrentPrize(null);
    setShowBrokenEgg(false);
    topAnim.setValue(0);
    bottomAnim.setValue(0);
    coinAnim.setValue(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.back?.() ?? router.push("/");
          }}
        >
          <Image source={require("../../assets/images/back-arrow.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Minigame</Text>
      </View>

      <View style={styles.fixedTokenContainer}>
        <Text style={styles.tokenText}>Tokens Left: {tokensLeft}</Text>
      </View>

      <View style={styles.content}>
        {!isCracking && !showBrokenEgg ? (
          <>
            <Text style={styles.instruction}>Click the egg to crack it!</Text>
            <TouchableOpacity onPress={handleCrack}>
              <Image source={require("../../assets/images/egg-full.png")} style={styles.egg} />
            </TouchableOpacity>
          </>
        ) : showBrokenEgg ? (
          <View style={styles.crackedContainer}>
            <Animated.Image
              source={currentPrize?.image}
              style={[styles.coin, { transform: [{ scale: coinAnim }] }]}
            />
            <Image source={require("../../assets/images/egg-broken.png")} 
              style={[styles.egg, { transform: [{ translateY: -90, }], width: 220, height: 220 }]} 
            />
            <Text style={styles.congratulations}>
              Congratulations! You got a {currentPrize?.name}!
            </Text>
            <Text style={styles.prizeText}>{currentPrize?.value} coins added to your balance!</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Text style={styles.resetButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.crackingContainer}>
            <Animated.Image
              source={require("../../assets/images/egg-top.png")}
              style={[styles.eggTop, { transform: [{ translateY: topAnim }] }]}
            />
            <Animated.Image
              source={require("../../assets/images/egg-bottom.png")}
              style={[styles.eggBottom, { transform: [{ translateY: bottomAnim }] }]}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.balanceText}>Current Balance: {Math.floor(balance)} coins</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1d2357",
    marginBottom: 15,
  },
  backButton: { marginTop: 40, marginRight: 8 },
  backIcon: { width: 30, height: 30, tintColor: "#fff" },
  headerText: { marginLeft: 120, marginTop: 40, fontSize: 18, color: "#fff", fontWeight: "bold" },
  fixedTokenContainer: {
    position: "absolute",
    top: 5,
    alignSelf: "center",
    zIndex: 10,
  },
  tokenText: { marginTop: 220, fontSize: 18, color: "blue", marginBottom: 10 },
  content: { flex: 1, marginTop: 190, alignItems: "center" },
  instruction: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
  egg: { width: 190, height: 190 },
  crackingContainer: { alignItems: "center", marginTop: 5 },
  eggTop: {
    position: "absolute",
    width: 190,
    height: 190,
    top: "40%",
    zIndex: 2,
  },
  eggBottom: {
    position: "absolute",
    width: 190,
    height: 190,
    top: "50%",
    zIndex: 1,
  },
  brokenEgg: {
    width: 300,
    height: 300,
    marginTop: 5,
  },
  coin: {
    width: 80,
    height: 80,
    position: "absolute",
    top: "5%",
    zIndex: 3,
  },
  crackedContainer: { alignItems: "center", marginTop: 50 },
  congratulations: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 0, 
    textAlign: "center"
  },
  prizeText: { 
    fontSize: 16, 
    color: "#555", 
    marginTop: 8, 
    textAlign: "center" },
  resetButton: {
    marginTop: 10,
    backgroundColor: "#1d2357",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 90,
    width: "100%",
  },
  balanceText: { marginBottom: 20, fontSize: 16, fontWeight: "bold" },
});