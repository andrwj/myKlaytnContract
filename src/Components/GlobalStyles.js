import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const globalStyles = createGlobalStyle`
    ${reset};
    a{
        text-decoration: none;
        color: inherit;
        font-weight: bold;
        color: #545454;
    }
    li {
        display:inline-block;
    }
    *{
        box-sizing:border-box;
    }
    body{
        font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size:12px;
        background-color: #f8f9fa;
        color:black;
        font-family: monospace;
    }

    .validate-ok {
      border: 1px solid green;
      border-radius: 10px;
    }
    .react-tabs__tab--selected {
        color: #031f42 !important;
        border: 1px solid #ccc;
        border-bottom: 0;
        width: 50%;
        text-align: center;
        padding: 25px 10px;
        font-size: 16px;
        font-weight: 700;
    }
`
export default globalStyles
