import { useNavigate, Link } from 'react-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { handleAxiosError } from '@/utils/axiosErrorHandler';
import { login } from '@/auth/api/auth';
import { Tooltip } from '@/shared/components/Tooltip';

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
    <div className="flex flex-col font-extrabold">
      <h1 className="text-xl font-extrabold">Welcome Back!</h1>
      <h2 className="text-base text-text-muted pb-4">
        New?{' '}
        <Link to="/register" className="text-action-secondary hover:text-action-secondary-hover">
          Create an account here.
        </Link>
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

        <label htmlFor="password">Password: </label>
        <div className="flex mb-6 ">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="p-1 border-2 border-muted w-full focus:border-action-secondary outline-none"
          />
          <Tooltip text="Minimum 8 characters. At least one number, one lowercase, and one uppercase letter" />
        </div>

        <button
          className="p-2 mb-2 mr-6 bg-action-primary text-main hover:bg-action-primary-hover"
          type="submit"
          disabled={isLoading}
        >
          Sign-in
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

export default LoginForm;
