import './App.css';
import { BrowserRouter } from "react-router-dom";
import "remixicon/fonts/remixicon.css"
import Router from './routes/Router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
