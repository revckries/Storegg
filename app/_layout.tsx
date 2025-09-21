import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import { BalanceProvider } from "../app-example/components/BalanceContext"; 
import ButtonBottom from "../app-example/components/ButtonBottom"; 

export default function DetailLayout() {
  return (
    <BalanceProvider>
      <View style={styles.container}>
        {/* Slot renders the child detail pages */}
        <Slot />

        {/* ButtonBottom component placed at the bottom of the layout */}
        <ButtonBottom />
      </View>
    </BalanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
