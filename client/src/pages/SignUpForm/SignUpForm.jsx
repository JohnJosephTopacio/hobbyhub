import '@/pages/SignUpForm/SignUpForm.css'
import { useState } from 'react'


function SignUpForm () {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  async function formHandler(e) {
    e.preventDefault();

    // Validate the username using regex
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
    if (!regex.test(username)) {
      setIsSuccess(false);
      setResultMessage('Username must be 6-16 characters. Starting with a letter. Only underscores are allowed as special characters.');
      return;
    }

    // If password and confirmation password does not match, notify the user
    if (!(password === confirmationPassword)) {
      setIsSuccess(false);
      setResultMessage('Passwords do not match.');
      return;
    }

    const registerUrl = "http://localhost:9000/auth/register";

    try{
      const response = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          email,
          username,
          password,
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setResultMessage(result.message);
        return;
      } 

      setIsSuccess(true);
      setResultMessage(result.message);

    } catch (error) {
      setResultMessage("Error. Please try again later.");
      console.error(error.message);
      return
    }
  }

  return (
    <form className="sign-up-form" id="sign-up-form" onSubmit={formHandler}>
      <label htmlFor="email">Email: </label>
      <input type="email" placeholder="Email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>

      <label htmlFor="username">Username: </label>
      <input type="text" placeholder="Username" name="username" id="username" value={username}onChange={(e) => {setUsername(e.target.value)}}/>

      <label htmlFor="password">Password: </label>
      <input type="password" placeholder="Password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>

      <label htmlFor="confirmation-password">Confirm Password: </label>
      <input type="password" placeholder="Confirm Password" name="confirmationPassword" id="confirmation-password" value={confirmationPassword} onChange={(e) => {setConfirmationPassword(e.target.value)}}/>

      <button type="submit">Submit</button>

      {resultMessage && <p className={isSuccess ? "success-message" : "error-message"}>{resultMessage}</p>}
   
    </form>
  );
}

export default SignUpForm;