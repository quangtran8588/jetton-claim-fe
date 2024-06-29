import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import App from "./App.tsx";
import theme from "./utils/theme.ts";

const manifestURL =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestURL}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
