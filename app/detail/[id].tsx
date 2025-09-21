import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBalance } from "../../app-example/components/BalanceContext";

type RouteParams = {
  id: string;
};

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
};

export default function ProductDetail() {
  const { balance, setBalance, purchasedProducts, addPurchasedProduct } =
    useBalance();
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as RouteParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setIsPurchased(purchasedProducts.some((p) => p.id === id));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id, purchasedProducts]);

 const handleBuy = (product: Product) => {
    if (!product) return;

    if (balance >= product.price) {
      setBalance(balance - product.price);
      addPurchasedProduct(product);
      Alert.alert("Purchase Successful", `You have purchased ${product.title}!`);
    } else {
      Alert.alert("Insufficient Coins", "You do not have enough coins to purchase this product.");
    }
  };

  useEffect(() => {
    if (product) {
      setIsPurchased(purchasedProducts.some((p) => p.id === product.id));
    }
  }, [purchasedProducts, product]);

  const handleImagePress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1d2357" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Image
            source={require("../../assets/images/back-arrow.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <TouchableOpacity onPress={handleImagePress}>
        <Image source={{ uri: product.image }} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.buttonContainer}>
        {isPurchased ? (
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        ) : (
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handleBuy(product)}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseModal}>
          <Image source={{ uri: product.image }} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1d2357",
    marginBottom: 30,
  },
  backButton: { marginTop: 40, marginRight: 8 },
  backIcon: { width: 30, height: 30, tintColor: "#fff" },
  headerTitle: {
    marginLeft: 100,
    marginTop: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  image: {
    marginBottom: 20,
    width: "90%",
    height: 200,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 10,
    maxWidth: 370,
    alignSelf: "center",
    padding: 10,
  },  
  title: { marginLeft: 30, fontSize: 24, fontWeight: "bold", marginBottom: 8, marginRight: 30},
  price: { marginLeft: 30, fontSize: 18, color: "green", marginBottom: 15 },
  description: { marginLeft: 30, fontSize: 16, color: "#555", marginBottom: 10, marginRight: 30 },
  buttonContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    width: "90%",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  outOfStockText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  loadingContainer: { backgroundColor: "white", flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red", marginBottom: 8 },
  goBackText: { color: "#1d2357", textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 10,
  },
});