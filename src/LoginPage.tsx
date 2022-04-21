import React, { useState } from 'react';
import configData from "./config.json";
import './LoginPage.css'

const LoginPage = () => {
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const myStorage = window.sessionStorage;
  async function loginUser(url: string, username: number, password: string) {
    if (!isNaN(username) && password !== "") {
      const loginInfo = {
        username, password
      };
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginInfo)
        });
        if (!response.ok) {
          switch (response.status) {
            case configData.STATUS_CODES.UNAUTHENTICATED:
              throw Error(configData.MESSAGES.NOT_VALID_ERR);
            default:
              throw Error(configData.MESSAGES.WENT_WRONG_ERR);
          }
        }
        let reader = response.body?.getReader();
        let decoder = new TextDecoder('utf-8');

        return reader?.read().then(function (result) {
          console.log(decoder.decode(result.value));
          myStorage.setItem('Token', decoder.decode(result.value));
          window.location.reload();
        });
      } catch(err) {
        alert(err);
      }
    } else {
      alert(configData.MESSAGES.IS_EMPTY_ERR);
    }
  }
  
  return (
    <div>
        <div className='box box-login'>
            <h1>Login</h1>
            <input required
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}></input>
            <input required
            placeholder='Password' type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => loginUser(configData.BASE_URL + "/login", parseInt(username), password)}>Login</button>
        </div>
    </div>
  )
}

export default LoginPage;