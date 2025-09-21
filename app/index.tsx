import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, ActivityIndicator } from "react-native";
import Card from "../app-example/components/Card";
import Header from "../app-example/components/Header";
import ButtonBottom from "../app-example/components/ButtonBottom";
import { useProductsAPI } from "../app-example/hooks/useApi";
import { useRouter } from "expo-router";

interface Product {
  id: number; 
  title: string;
  price: number;
  image: string;
  description: string;
}

const Index: React.FC = () => {
  const { products, loading, error } = useProductsAPI(); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [isGridView, setIsGridView] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    if (!loading && products.length > 0) {
      setFilteredProducts(products); 
    }
  }, [products, loading]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    if (query === "") {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered); 
    }
  };

  const toggleView = () => {
    setIsGridView((prev) => !prev); 
  };

  const handleCardPress = (product: Product) => {
    router.push({
      pathname: `/detail/[id]`,
      params: {
        id: product.id.toString(), 
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        isGridView: isGridView.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header onSearch={handleSearch} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1d2357" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Products</Text>
            <TouchableOpacity onPress={toggleView}>
              <Image
                source={isGridView
                  ? require("../assets/images/grid-icon.png")
                  : require("../assets/images/list-icon.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredProducts} 
            key={isGridView ? "GRID" : "LIST"}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCardPress(item)}>
                <Card
                  name={item.title}
                  price={`$${item.price}`}
                  image={{ uri: item.image }}
                  isGridView={isGridView}
                />
              </TouchableOpacity>
            )}
            numColumns={isGridView ? 2 : 1}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={isGridView ? styles.columnWrapper : undefined}
          />
          <ButtonBottom onPress={() => router.push("/minigame")} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 16 },
  sectionTitle: { padding: 15, fontSize: 18, fontWeight: "bold", color: "#333" },
  iconImage: { marginTop: 8, width: 40, height: 40, tintColor: "#333" },
  columnWrapper: { justifyContent: "center", paddingHorizontal: 8 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { textAlign: "center", marginTop: 10, fontSize: 16, color: "#333" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },
});

export default Index;
