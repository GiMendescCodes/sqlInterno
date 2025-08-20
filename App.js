import { Inicial } from './inicial';

export default function App() {
  return (
    <SQLiteProvider databaseName="meusDados.db" onInit={IniciarBD}>
      <Inicial />
    </SQLiteProvider>
  );
};
