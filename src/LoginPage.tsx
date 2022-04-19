import React, { useState } from 'react';
import './LoginPage.css'

const BASE_URL = 'https://localhost:443/login';
const UNAUTHENTICATED = 401;
const NOT_VALID_ERR = "Your username or password is not valid, please try again."
const IS_EMPTY_ERR = "Please enter your username and password."
const WENT_WRONG_ERR = 'Something went wrong :(';

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
            case UNAUTHENTICATED:
              throw Error(NOT_VALID_ERR);
            default:
              throw Error(WENT_WRONG_ERR);
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
      alert(IS_EMPTY_ERR);
    }
  }
  const onSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
  };

  return (
    <div>
        <form className='box box-login' onSubmit={onSubmit}>
            <h1>Login</h1>
            <input required
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}></input>
            <input required
            placeholder='Password' type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => loginUser(BASE_URL, parseInt(username), password)}>Login</button>
        </form>
    </div>
  )
}

export default LoginPage