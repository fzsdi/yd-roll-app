import React from 'react'
import { useContext } from 'react';
import { LoginContext } from './LoginContext';

const Header = () => {
  const username = useContext(LoginContext);
  function handleLogOut() {
    window.sessionStorage.removeItem('Token');
    window.location.reload();
  }
  return (
    <div className='box-logout'>
        <p onClick={handleLogOut}>({username}) Logout</p>
    </div>
  )
}

export default Header