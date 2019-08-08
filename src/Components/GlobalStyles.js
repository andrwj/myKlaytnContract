import { createGlobalStyle } from 'styled-components'

const globalStyles = createGlobalStyle`
    #myklaytn-contract {
        padding: 20px;
    }
    .validate-ok {
      border: 1px solid green;
      border-radius: 10px;
    }

    ul[role="tablist"] {
      margin: 0 !important;
      padding: 0 !important;
    }
    li[role="tab"] {
      border-bottom: 1px solid #ccc;
      list-style-type: none !important;
    }
    li[role="tab"].react-tabs__tab--selected {
      border-bottom: 0;
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
