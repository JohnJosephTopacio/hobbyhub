import { useState } from 'react';
import { useNavigate } from 'react-router';
import { handleAxiosError } from '@/utils/axiosErrorHandler';
import { register } from '@/auth/api/auth';
import { Tooltip } from '@/shared/components/Tooltip';

const regex = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;

function RegisterForm() {
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
      const { message } = await register({ email, username, password });
      setIsSuccess(true);

      // Clear the input fields in the UI
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmationPassword('');

      // Notify user of redirection then redirect
      setResultMessage(message + ' Redirecting to login');
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
    <div className="flex flex-col font-extrabold">
      <h1 className="text-xl font-extrabold">Create Your Account</h1>
      <h2 className="text-base text-text-muted pb-2">
        Already registered? <span className="text-action-secondary">Sign in here.</span>
      </h2>
      <form className="flex flex-col" onSubmit={formHandler}>
        <label htmlFor="email">Email: </label>
        <div className="flex mb-2">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="p-1 border-2 border-muted w-full focus:border-action-secondary outline-none"
          />
          <Tooltip text="Ex. johndoe@email.com" />
        </div>

        <label htmlFor="username">Username: </label>
        <div className="flex mb-2">
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-1 border-2 border-muted w-full focus:border-action-secondary outline-none"
          />
          <Tooltip text="6-16 characters, starting with a letter. Letters, numbers, and underscores only." />
        </div>

        <label htmlFor="password">Password: </label>
        <div className="flex mb-2">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-1 border-2 border-muted w-full focus:border-action-secondary outline-none"
          />
          <Tooltip text="Minimum 8 characters. At least one number, one lowercase, and one uppercase letter" />
        </div>

        <label htmlFor="confirmation-password">Confirm Password: </label>
        <div className="flex mb-6">
          <input
            type="password"
            name="confirmationPassword"
            id="confirmation-password"
            value={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            className="p-1 border-2 border-muted w-full focus:border-action-secondary outline-none mr-[25px]"
          />
        </div>

        <button
          className="p-2 mb-2 bg-action-primary text-main hover:bg-action-primary-hover"
          type="submit"
          disabled={isLoading}
        >
          Sign-up
        </button>

        {resultMessage && (
          <p
            className={`text-feedback-error text-sm {isSuccess ? 'success-message' : 'error-message'}`}
          >
            {resultMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export default RegisterForm;
