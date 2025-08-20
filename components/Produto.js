import { Pressable, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export function Produto({ data, onDelete }) {
  return (
    <Pressable style={styles.container}>
      <Text style={styles.text}>
        {data.quantidade} - {data.nome}
      </Text>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CECECE",
    padding: 24,
    borderRadius: 5,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
});
