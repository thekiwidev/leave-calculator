import "./App.css";
import Calculate from "./components/Calculate";
import FormContainer from "./components/FormContainer";
import Header from "./components/Header";
import Output from "./components/Output";

function App() {
  return (
    <div className="App py-5 px-2 m-5 rounded-xl">
      <Header />
      <Output />
      <FormContainer />
      <Calculate />
    </div>
  );
}

export default App;
