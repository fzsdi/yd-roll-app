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
  socket = new WebSocket(`ws://localhost:8080/channel?token=${userToken}`);
  parseJwt(userToken!);
}
 
export default class App extends Component {
  
  componentDidMount() {
    if (userToken) {
      socket.onopen = () => {
        (window as any).Socket = socket;
        alert("[WebSocket] connection established.");
      };
  
      socket.onclose = (event) => {
        alert("[WebSocket] connection closed. Code: " + (event.code.toString()));
      };
  
      socket.onmessage = (event) => {
        alert(`[WebSocket] received message: ${event.data.toString()}`);
      };
    }
  }
  
  render() {
    return (
      <UserContext.Provider value={ userRole }>
        <LoginContext.Provider value={ username }>
        { userToken ? <Content /> : <LoginPage /> }
        </LoginContext.Provider>
      </UserContext.Provider> 
    )
  }
}