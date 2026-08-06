import '@/pages/SignUpForm/SignUpForm.css';
import { useState } from 'react';
import { instance } from '@/utils/axiosInstance';
import { useNavigate } from 'react-router';
import { handleAxiosError } from '@/utils/axiosErrorHandler';

interface RegisterResponse {
  message: string;
}

const regex = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function formHandler(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    // Validate the username using regex
    if (!regex.test(username)) {
      setIsSuccess(false);
      setResultMessage(
        'Username must be 6-16 characters. Starting with a letter. Only underscores are allowed as special characters.',
      );
      return;
    }

    // If password and confirmation password does not match, notify the user
    if (password !== confirmationPassword) {
      setIsSuccess(false);
      setResultMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await instance.post<RegisterResponse>('auth/register', {
        email,
        username,
        password,
      });
      setIsSuccess(true);

      // Clear the input fields in the UI
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmationPassword('');

      // Notify user of redirection then redirect
      setResultMessage(response.data.message + ' Redirecting to login');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setIsSuccess(false);
      // Upon non 2xx errors, axios throws an AxiosError object
      setResultMessage(handleAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="sign-up-form" id="sign-up-form" onSubmit={formHandler}>
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

      <label htmlFor="username">Username: </label>
      <input
        type="text"
        placeholder="Username"
        name="username"
        id="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
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

      <label htmlFor="confirmation-password">Confirm Password: </label>
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmationPassword"
        id="confirmation-password"
        value={confirmationPassword}
        onChange={(e) => {
          setConfirmationPassword(e.target.value);
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

export default SignUpForm;
