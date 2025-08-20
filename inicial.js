import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import { usarBD } from "./hooks/usarBD";

function Produto({ data, selected, onPress, onDelete }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected ? styles.cardSelected : null]}
    >
      <Text style={styles.cardText}>{data.nome}</Text>
      <Text style={styles.cardText}>Qtd: {data.quantidade}</Text>
      <Button title="Excluir" onPress={onDelete} />
    </Pressable>
  );
}

export default function Inicial() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const produtosBD = usarBD();

  const listar = useCallback(async () => {
    const captura = await produtosBD.read(pesquisa);
    setProdutos(captura);
  }, [pesquisa]);

  useEffect(() => {
    listar();
  }, [listar]);

  const salvar = async () => {
    if (!nome || !quantidade) return;
    if (isNaN(quantidade)) {
      return Alert.alert("Quantidade", "A quantidade precisa ser um número!");
    }

    try {
      if (selectedId) {
        await produtosBD.update(selectedId, {
          nome,
          quantidade: Number(quantidade),
        });
        Alert.alert("Produto atualizado!");
      } else {
        const item = await produtosBD.create({
          nome,
          quantidade: Number(quantidade),
        });
        setId(item.idProduto);
        setSelectedId(item.idProduto);
        Alert.alert("Produto cadastrado!");
      }
      listar();
    } catch (error) {
      console.log(error);
    }
  };

  const remover = async (idProduto) => {
    await produtosBD.remove(idProduto);
    if (selectedId === idProduto) {
      setSelectedId(null);
      setId("");
      setNome("");
      setQuantidade("");
    }
    listar();
  };

  const handleSelect = (item) => {
    setSelectedId(item.idProduto);
    setId(item.idProduto);
    setNome(item.nome ?? "");
    setQuantidade(String(item.quantidade ?? ""));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.texto}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.texto}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <Button title={selectedId ? "Atualizar" : "Salvar"} onPress={salvar} />

      <TextInput
        style={styles.texto}
        placeholder="Pesquisar"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={produtos}
        keyExtractor={(item) => String(item.idProduto)}
        extraData={selectedId}
        renderItem={({ item }) => (
          <Produto
            data={item}
            selected={item.idProduto === selectedId}
            onPress={() => handleSelect(item)}
            onDelete={() => remover(item.idProduto)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16, gap: 12 },
  texto: {
    height: 54,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#999",
    paddingHorizontal: 16,
  },
  listContent: { gap: 12, paddingBottom: 12 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  cardSelected: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#e6ffe6",
  },
  cardText: { fontSize: 16, marginBottom: 4 },
});
