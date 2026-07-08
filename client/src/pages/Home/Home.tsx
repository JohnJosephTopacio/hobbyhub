import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext';

const getMeUrl = new URL("auth/me", import.meta.env.VITE_BACKEND_SERVER_URL);

interface Result {
  username?: string
}

function Home () {  
  // generic type parameters are used to derive the return type
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  const accessToken = auth.accessToken;

  useEffect(()=> {  
    async function fetchUserData() {
      console.log(`Access token ${accessToken}`)
      try {
        const response = await fetch(getMeUrl, {
          credentials: "include",
          method: "GET",
          headers: {Authorization: `Bearer ${accessToken}`}
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const result = await response.json();
        setResult(result);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
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