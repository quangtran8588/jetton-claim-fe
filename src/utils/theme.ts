import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "gray.300",
        bg: "blackAlpha.900",
      },
    },
  },
  colors: {
    gradient: {
      100: "linear-gradient(to right, #ff7e5f, #feb47b)", // gradient from pink to orange
      200: "linear-gradient(to right, #6a11cb, #2575fc)", // gradient from purple to blue
    },
    background: {
      100: "linear-gradient(to left, #000000, #0d1a27)",
    },
    tag: {
      100: "#FFFF00",
    },
  },
});

export default theme;
