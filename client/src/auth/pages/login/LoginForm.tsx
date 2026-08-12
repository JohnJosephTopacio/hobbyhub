import '@/auth/pages/login/LoginForm.css';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { handleAxiosError } from '@/utils/axiosErrorHandler';
import { login } from '@/auth/api/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const auth = useAuth();
  const { setToken } = auth;

  async function formHandler(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const { accessToken } = await login({ email, password });

      setToken(accessToken);
      setIsSuccess(true);
      setResultMessage('Successful Logon!');

      navigate('/home');
    } catch (error) {
      setIsSuccess(false);
      setResultMessage(handleAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={formHandler}>
      <label htmlFor="email">Email: </label>
      <input
        type="email"
        placeholder="Email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <label htmlFor="password">Password: </label>
      <input
        type="password"
        placeholder="Password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>

      {resultMessage && (
        <p className={isSuccess ? 'success-message' : 'error-message'}>{resultMessage}</p>
      )}
    </form>
  );
}

export default LoginForm;
