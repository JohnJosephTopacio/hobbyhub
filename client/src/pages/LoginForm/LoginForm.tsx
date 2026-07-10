import '@/pages/LoginForm/LoginForm.css'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

const backendServerUrl = import.meta.env.VITE_BACKEND_SERVER_URL  
// using URL constructor is better than concatenation because it handles both http://localhost and http://localhost/ - in case the environment variable changes. It also handles encoding or escaping automatically. 

const loginUrl = new URL("auth/login", backendServerUrl);

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const auth = useAuth();
  const { setAccessToken } = auth;

  async function formHandler(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const result = await response.json();
  
      if (!response.ok) {
        setIsSuccess(false);
        setResultMessage(result.message);
        return;
      } 

      const accessToken = result.accessToken;
      setAccessToken(accessToken);

      setIsSuccess(true);
      setResultMessage('Successful Logon!');

      navigate('/home');

    } catch (error) {
      if (error instanceof Error) {
        setIsSuccess(false);
        setResultMessage("Error. Please try again later.");
        console.error(error.message);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <form className="login-form" onSubmit={formHandler}>
      <label htmlFor="email">Email: </label>
      <input type="email" placeholder="Email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>

      <label htmlFor="password">Password: </label>
      <input type="password" placeholder="Password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>

      <button type="submit">Submit</button>

      {resultMessage && <p className={isSuccess ? "success-message" : "error-message"}>{resultMessage}</p>}
    </form>

  );
}

export default LoginForm;