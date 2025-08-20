import { Inicial } from "./inicial";
import { SQLiteProvider } from "expo-sqlite";
import { IniciarBD } from "./databases/iniciarBD";

export default function App() {
  return (
    <SQLiteProvider databaseName="meusDados.db" onInit={IniciarBD}>
      <Inicial />
    </SQLiteProvider>
  );
}
