import React from 'react'

const Header = () => {
  function handleLogOut() {
    window.sessionStorage.removeItem('Token');
    window.location.reload();
  }
  return (
    <div className='box-logout'>
        <p onClick={handleLogOut}>Logout</p>
    </div>
  )
}

export default Header