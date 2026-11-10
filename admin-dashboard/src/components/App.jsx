import { useSelector } from "react-redux";

function App() {
  const theme = useSelector((state) => state.theme.mode);

  return (
    <div>
      <h1>React Admin Dashboard</h1>
      <p>Current Theme: {theme}</p>
    </div>
  );
}

export default App;