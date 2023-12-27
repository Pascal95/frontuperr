import './App.css';
import { BrowserRouter } from "react-router-dom";
import "remixicon/fonts/remixicon.css"
import Router from './routes/Router';

function App() {
  return (
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  );
}

export default App;
