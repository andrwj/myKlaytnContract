import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../assets/imgs/new-logo-primary.png'

const Header = styled.header`
  color: black;
  width: 100%;
  height: 70px;
  // display: flex;
  z-index: 10;
  background-color: #fff;
  border-bottom: 1px solid #e7eaf3;
  box-shadow: 0 0.5rem 1.2rem rgba(189, 197, 209, 0.2);
  position: absolute;
  top: 0;
`

const List = styled.ul`
  max-width: 1140px;
  padding: 0 30px;
  margin: 0 auto;
  display: flex;
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
  <Header>
    <List>
      <Item current={pathname === '/'}>
        <SLink to="/">
          <img src={logo} width="140" />
        </SLink>
      </Item>
      {/* <Item current={pathname === '/tv'}>
        <SLink to="/tv">TV</SLink>
      </Item>
      <Item current={pathname === '/search'}>
        <SLink to="/search">Search</SLink>
      </Item> */}
    </List>
  </Header>
))
