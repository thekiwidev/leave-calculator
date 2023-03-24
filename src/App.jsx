import "./App.css";
import Calculate from "./components/Calculate";
import FormContainer from "./components/FormContainer";
import Header from "./components/Header";
import Output from "./components/Output";
import ContextProvider from "./contexts/Context";

function App() {
  return (
    <ContextProvider>
      <div className="App py-5 px-2 m-5 rounded-xls">
        <Header />
        <Output />
        <div>
          <FormContainer />
          <Calculate />
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
