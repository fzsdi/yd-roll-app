import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Content from './Content';
import LoginPage from './LoginPage';

function App() {
  var testSocket = new WebSocket("ws://localhost:443/ws");
  testSocket.onmessage = function (e) {
    alert(e.data);
  }

  function Send() {
    testSocket.send("texttext");
  }
  Send();
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