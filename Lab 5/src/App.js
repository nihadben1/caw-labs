import ClickButton from "./components/ClickButton";
import ToggleButton from "./components/ToggleButton";
import ThreeButtons from "./components/ThreeButtons";
import Counter from "./components/Counter";
import DisplayTab from "./components/DisplayTab";
import AuthForm from "./components/AuthForm";
import AddDivs from "./components/AddDivs";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Exercise 1</h1>
      <ClickButton />
      <ToggleButton />
      <ThreeButtons />
      <Counter />

      <h1>Exercise 2</h1>
      <DisplayTab data={["hello", "world", "from", "react"]} />
      <DisplayTab data={["one", "two", "three"]} />

      <h1>Exercise 3</h1>
      <AuthForm />

      <h1>Exercise 4</h1>
      <AddDivs />
    </div>
  );
}

export default App;
