import React, { Component } from 'react'
import Router from 'Components/Router'
import styled from 'styled-components'
import GlobalStyles from 'Components/GlobalStyles'

const Wrap = styled.div`
  // width: 100%;
  // height: 100vh;
  // margin: 0 auto;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
