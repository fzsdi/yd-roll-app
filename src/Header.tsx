import React from 'react'

const Header = () => {
  function handleLogOut() {
    window.sessionStorage.removeItem('Token');
    window.location.reload();
  }
  return (
    <div>
        <p style={{margin: '10px 0px 0px 10px', color: 'blue'}} onClick={handleLogOut}>Logout</p>
    </div>
  )
}

export default Header