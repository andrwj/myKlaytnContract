import React, { Component } from 'react'
import Router from 'Components/Router'
import styled from 'styled-components'
import GlobalStyles from 'Components/GlobalStyles'

const Wrap = styled.div`
  width: 100%;
  margin: 0 auto;
`

class App extends Component {
  render() {
    return (
      <>
        <Wrap>
          <Router />
          <GlobalStyles />
        </Wrap>
      </>
    )
  }
}

export default App
