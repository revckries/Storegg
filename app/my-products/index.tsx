import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBalance } from "../../app-example/components/BalanceContext";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

export default function MyProducts() {
  const { purchasedProducts, setBalance, balance, removePurchasedProduct } =
    useBalance();
  const navigation = useNavigation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSell = (productId: string) => {
    const productToSell = purchasedProducts.find(
      (product) => product.id === productId
    );

    if (!productToSell) {
      Alert.alert("Error", "Product not found.");
      return;
    }

    setBalance(balance + productToSell.price);

    removePurchasedProduct(productId);

    Alert.alert("Sell Successful", `${productToSell.title} has been sold!`);
  };

  const handleItemPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  if (purchasedProducts.length === 0) {
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
          <Text style={styles.headerTitle}>My Products</Text>
        </View>
        <Text style={styles.emptyText}>
          You haven't purchased any products yet.
        </Text>
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
        <Text style={styles.headerTitle}>My Products</Text>
      </View>

      <FlatList
        data={purchasedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={() => handleSell(item.id)}
              >
                <Text style={styles.sellButtonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            {selectedProduct && (
              <>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <Text style={styles.modalPrice}>
                  Price: ${selectedProduct.price.toFixed(2)}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedProduct.description}
                </Text>
                <TouchableOpacity
                  style={styles.sellButton}
                  onPress={() => {
                    handleSell(selectedProduct.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.sellButtonText}>Sell</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1d2357",
    marginBottom: 15,
  },
  backButton: { marginTop: 40, marginRight: 8 },
  backIcon: { width: 30, height: 30, tintColor: "#fff" },
  headerTitle: {
    marginLeft: 110,
    marginTop: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyText: {
    marginTop: 40,
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#555",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "88%",
    alignSelf: "center",
    alignItems: "center", 
    justifyContent: "space-between", 
  },
  productImage: {
    width: 85, 
    height: 85, 
    marginRight: 25,
    resizeMode: "contain",
    borderRadius: 10,
  },
  productInfo: { 
    flex: 1,  
    justifyContent: "center"
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    marginRight: 12
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  sellButtonWrapper: {
    justifyContent: "center", 
    alignItems: "center", 
    flex: 1, 
  },
  sellButton: {
    marginLeft: 5,
    marginRight: 6,
    backgroundColor: "#ff6f61",
    width: 55,
    height: 30,
    borderRadius: 4,
    justifyContent: "center", 
    alignItems: "center",
    display: "flex", 
  },
  sellButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 30, 
  },  
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "transparent",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  modalImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
    marginTop: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 16,
    color: "green",
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    textAlign: 'center',
  },
});
