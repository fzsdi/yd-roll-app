import './App.css';
import Content from './Content';
import LoginPage from './LoginPage';

function App() {
  const myStorage = window.sessionStorage;
  const userToken = myStorage.getItem('Token');

  return userToken ? <Content /> : <LoginPage />
}

export default App;