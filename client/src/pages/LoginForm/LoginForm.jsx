import '@/pages/LoginForm/LoginForm.css'
import { useState } from 'react'


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function formHandler(e) {
    e.preventDefault();

    const loginUrl = "http://localhost:9000/auth/login";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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

      setIsSuccess(true);
      setResultMessage('Successful Logon!');

    } catch (error) {
      setResultMessage("Error. Please try again later.");
      console.error(error.message);
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