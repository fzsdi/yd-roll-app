import { Component } from 'react';
import './App.css';
import Content from './Content';
import LoginPage from './LoginPage';

const myStorage = window.sessionStorage;
const userToken = myStorage.getItem('Token');
let socket = new WebSocket(`ws://localhost:8080/channel?token=${userToken}`);
 
export default class App extends Component {
  
  componentDidMount() {

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
  
  render() {
    return userToken ? <Content /> : <LoginPage />
  }
}