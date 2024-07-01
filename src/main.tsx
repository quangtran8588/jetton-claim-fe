import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import App from "./App.tsx";
import theme from "./utils/theme.ts";

const manifestURL = import.meta.env.VITE_MANIFEST_URL as string;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestURL}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
