import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

const getMeUrl = new URL("auth/me", import.meta.env.VITE_BACKEND_SERVER_URL);

function Home () {  
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=> {
    async function fetchUserData() {
      try {
        const response = await fetch(getMeUrl, {
          credentials: "include",
          method: "GET",
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
        console.error(error.message);
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