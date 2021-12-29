import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    html, body, h1, h2, h3, h4, h5, h6, div, p, blockquote, pre, code, address, ul, ol, li, menu, nav, section, article, aside, 
    dl, dt, dd, table, thead, tbody, tfoot, label, caption, th, td, form, fieldset, legend, hr, input, button, textarea, object, 
    figure, figcaption {
        margin: 0;
        padding: 0;
    }

    div {
      display: block;
    }

    html, body {
        width: 100%;
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;

export default GlobalStyles;
