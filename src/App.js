import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="wrap">
        <header>
          <div className="header-wrap justify-between container">
            <div className="logo-area">
              <a className="logo-btn" href="https://insureum.co" title="logo">
                <img
                  src="https://s3.amazonaws.com/insureum.co/img/new-logo-primary.png"
                  alt="logo"
                />
              </a>
            </div>
            <div className="header-select">
              <select>
                <option>Network Ropsten</option>
              </select>
              <select>
                <option>Network Ropsten</option>
              </select>
            </div>
          </div>
          <nav className="container">
            <div>
              <a className="link" href="" title="contracts">
                <span>Contracts</span>
              </a>
              <a className="link" href="" title="contracts">
                <span>Contracts</span>
              </a>
            </div>
          </nav>
        </header>
        <section className="section container">
          <div className=" section-1">
            <h2>
              <span style={{ fontWeight: 300 }}>
                Interact with Contract or{' '}
              </span>
              <a href="" title="" className="event-click">
                Deploy Contract
              </a>
            </h2>
          </div>
          <div className=" section-2">
            <div className="justify-between">
              <div className="col">
                <span>Contract Address</span>
                <input
                  className="input-box"
                  placeholder="mewtopia.eth or 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
                />
              </div>
              <div className="col">
                <span>Select Existing Contract</span>
                <select className="input-box">
                  <option>Select a contract...</option>
                </select>
              </div>
            </div>
            <div className="col">
              <span>ABI /JSON Interface</span>
              <textarea className="input-box" placeholder="" />
              <button>Access</button>
            </div>
          </div>
        </section>
        <section className="footer-section">
          <div className="container">
            MyEtherWallet.com does not hold your keys for you. We cannot access
            accounts, recover keys, reset passwords, nor reverse transactions.
            Protect your keys & always check that you are on correct URL. You
            are responsible for your security.
          </div>
        </section>
        <footer>
          <div className="footer-area justify-between container">
            <div className="logo-area">
              <a className="logo-btn" href="" title="">
                <img
                  src="https://s3.amazonaws.com/insureum.co/img/logo-white.png"
                  alt=""
                />
              </a>
            </div>
            <div>asd</div>
          </div>
          <div className="hr container" />
          <div className="copy container">INSUREUM &copy; 2019</div>
        </footer>
      </div>
    </div>
  )
}

export default App
