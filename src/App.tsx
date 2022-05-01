import { Component } from 'react';
import './App.css';
import Content from './Content';
import LoginPage from './LoginPage';
import { UserContext } from './UserContext';
import { LoginContext } from './LoginContext';

const myStorage = window.sessionStorage;
const userToken = myStorage.getItem('Token');
let socket: WebSocket;

let userRole = "";
let username = "";

socket = new WebSocket(`ws://localhost:8080/channel?token=${userToken}`);

function parseJwt (token:string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  var parsedJSON = JSON.parse(jsonPayload);
  userRole = parsedJSON.role;
  username = parsedJSON.sub;
};

if (userToken) {
  parseJwt(userToken!);
}

const onRefresh = (): void => {};
 
export default class App extends Component {
  render() {
    return (
      <UserContext.Provider value={ userRole }>
        <LoginContext.Provider value={ username }>
        { userToken ? <Content onRefresh={onRefresh} socket={socket} /> : <LoginPage /> }
        </LoginContext.Provider>
      </UserContext.Provider> 
    )
  }
}