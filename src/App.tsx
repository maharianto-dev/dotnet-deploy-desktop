import { Provider } from "react-redux";
import "./App.css";
import Layout from "./components/Layout";
import { globalStore } from "./redux/store";

function App() {
  return (
    <Provider store={globalStore}>
      <Layout></Layout>
    </Provider>
  );
}

export default App;
