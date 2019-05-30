import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Header from 'Components/Header'
import Contract from 'Routes/Contract/Contract'
import Footer from 'Components/Footer'

export default () => (
  <Router>
    <>
      <Header />
      <Switch>
        <Route path="/" exact component={Contract} />
        <Redirect from="*" to="/" />
      </Switch>
      <Footer />
    </>
  </Router>
)
