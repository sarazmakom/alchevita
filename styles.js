import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui;
  }

  :root {
  --primary: #1FAB89;
  --secondary: #62D2A2;
  --background: #D7FBE8;
  --text-dark: #0E6F5D;
} 
`;
