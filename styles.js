import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  :root {
  --primary: #1FAB89;
  --secondary: #62D2A2;
  --background: #D7FBE8;
  --text-dark: #0E6F5D;
  --color-danger-bg: #f8d7da;
  --color-danger-text: #e20a40;
  --color-danger-border: #eb979f;
  --color-danger-hover-bg: #f1c0c4;
  --color-disabled: #92a29f;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Manrope', system-ui, Arial, sans-serif;
  }
`;
