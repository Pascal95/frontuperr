import React from "react";
import './App.css';
import { BrowserRouter } from "react-router-dom";
import "remixicon/fonts/remixicon.css"
import Router from './routes/Router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './stripe-config';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Router/>
        </Elements>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
