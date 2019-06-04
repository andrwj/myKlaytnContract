import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../assets/imgs/new-logo-primary.png'
import logoWhite from '../assets/imgs/logo-white.png'

const Footer = styled.footer`
  color: black;
  width: 100%;
  height: 70px;
  // display: flex;
  z-index: 10;
  background-color: #586878;
  position: absolute;
  bottom: 0;
`

const List = styled.ul`
  max-width: 1140px;
  padding: 0 30px;
  margin: 0 auto;
  display: flex;
  // padding-bottom: 10px;
  // border-bottom: 1px solid #fff;
`
const Item = styled.li`
  height: 50px;
  text-align: center;
  // border-bottom: 5px solid
  //   ${props => (props.current ? '#3498db' : 'transparent')};
  // transition: border-bottom 0.3s ease-in-out;
`

const SLink = styled(Link)`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default withRouter(({ location: { pathname } }) => (
  <Footer>
    <List>
      <Item>
        <SLink to="/">
          {/* <img src={logoWhite} width="140" /> */}
          <span style={{ color: '#fff', fontFamily: 'notosans' }}>
            Copyright © 2019 Insureum. All Rights Reserved.
          </span>
        </SLink>
      </Item>
      {/* <Item current={pathname === '/tv'}>
        <SLink to="/tv">TV</SLink>
      </Item>
      <Item current={pathname === '/search'}>
        <SLink to="/search">Search</SLink>
      </Item> */}
    </List>
  </Footer>
))
