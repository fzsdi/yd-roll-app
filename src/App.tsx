import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Content from './Content';
import LoginPage from './LoginPage';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const myStorage = window.sessionStorage;
  const userToken = myStorage.getItem('Token');

  if (userToken !== null) {
     return (
       <Content />
     );
  } else {
    return (
      <LoginPage />
    );
  }
}

export default App;