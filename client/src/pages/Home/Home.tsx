import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { instance, isAxiosError } from '@/utils/axiosInstance'
import { handleAxiosError } from '@/utils/axiosErrorHandler'

interface Result {
  username?: string
}

interface UserInfo {
  username: string,
  email: string,
  created_at: Date
}

function Home () {  
  // generic type parameters are used to derive the return type
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // const auth = useAuth();
  // const accessToken = auth.accessToken;

  useEffect(()=> { 
    
    
    async function fetchUserData() {
      try {
        const response = await instance
        .get<UserInfo>('auth/me');

        if (response.statusText !== 'OK') {
          throw new Error('Failed to fetch user');
        }

        setResult(response.data);
      } catch (error) {
        console.error(handleAxiosError(error));
        if (isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            navigate('/login');
            return;
          };
        }   
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();

  }, []);
  
  return (
    <>   
      { isLoading ? <p>Loading</p> : result ? <p>Hello user, {result.username}</p>: <p>Failed to fetch user.</p> }
    </>
   
  );
}

export default Home;