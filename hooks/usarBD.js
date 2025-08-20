// usarBD.js
import * as SQLite from "expo-sqlite";

// abre ou cria o banco de dados
const bd = SQLite.openDatabase("produtos.db");

export function usarBD() {
  // cria a tabela se não existir
  const createTable = () => {
    bd.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS produtos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT,
          quantidade INTEGER
        );`
      );
    });
  };

  createTable();

  // CRIAR
  function create(dados) {
    return new Promise((resolve, reject) => {
      bd.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO produtos (nome, quantidade) VALUES (?, ?);",
          [dados.nome, dados.quantidade],
          (_, result) => resolve({ idProduto: result.insertId }),
          (_, error) => reject(error)
        );
      });
    });
  }

  // LER
  function read(nome) {
    return new Promise((resolve, reject) => {
      bd.transaction((tx) => {
        tx.executeSql(
          "SELECT id as idProduto, nome, quantidade FROM produtos WHERE nome LIKE ?;",
          [`%${nome}%`],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  }

  // REMOVER
  function remove(idProduto) {
    return new Promise((resolve, reject) => {
      bd.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM produtos WHERE id = ?;",
          [idProduto],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  // ATUALIZAR
  function update(idProduto, dados) {
    return new Promise((resolve, reject) => {
      bd.transaction((tx) => {
        tx.executeSql(
          "UPDATE produtos SET nome = ?, quantidade = ? WHERE id = ?;",
          [dados.nome, dados.quantidade, idProduto],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  return { create, read, remove, update };
}