import { useSQLiteContext } from "expo-sqlite";

export function usarBD() {
  const bd = useSQLiteContext();

  async function create(dados) {
    const regras = await bd.prepareAsync(
      "INSERT INTO produtos (nome, quantidade) VALUES ($nome, $quantidade)"
    );

    try {
      const result = await regras.executeAsync({
        $nome: dados.nome,
        $quantidade: dados.quantidade,
      });

      const idProduto = result.lastInsertRowId; // mantém como número
      return { idProduto };
    } catch (error) {
      throw error;
    } finally {
      await regras.finalizeAsync();
    }
  }

  async function read(nome) {
    try {
      // renomeia id para idProduto
      const consulta =
        "SELECT id as idProduto, nome, quantidade FROM produtos WHERE nome LIKE ?";
      const resposta = await bd.getAllAsync(consulta, `%${nome}%`);
      return resposta;
    } catch (error) {
      throw error;
    }
  }

  async function remove(idProduto) {
    try {
      await bd.execAsync("DELETE FROM produtos WHERE id = " + idProduto);
    } catch (error) {
      throw error;
    }
  }

  return { create, read, remove };
}
