import '@/pages/LoginForm/LoginForm.css'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { instance, isAxiosError } from '@/utils/axiosInstance'

interface loginResponse {
  message: string,
  accessToken: string
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const auth = useAuth();
  const { login } = auth;

  async function formHandler(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance
      .post<loginResponse>('auth/login', {
        email,
        password
      });

      login(response.data.accessToken); 
      setIsSuccess(true);
      setResultMessage('Successful Logon!');

      navigate('/home');
    } catch(error) {
      setIsSuccess(false);
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          setResultMessage(error.response.data.message);
        } else {
          setResultMessage('Axios Error');
        }
      } else if (error instanceof Error) {
        setResultMessage(error.message);
      } else {
        setResultMessage('Unexpected Error.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={formHandler}>
      <label htmlFor="email">Email: </label>
      <input type="email" placeholder="Email" name="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>

      <label htmlFor="password">Password: </label>
      <input type="password" placeholder="Password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>

      <button type="submit" disabled={isLoading}>Submit</button>

      {resultMessage && <p className={isSuccess ? "success-message" : "error-message"}>{resultMessage}</p>}
    </form>
  );
}

export default LoginForm;