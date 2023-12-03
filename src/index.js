import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./custom-styles.css"
import { HashRouter } from "react-router-dom";
const container = document.getElementById("root");
const root = createRoot(container);
import { ChakraProvider } from '@chakra-ui/react';

root.render(
  
   <ChakraProvider>
      <App />
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();