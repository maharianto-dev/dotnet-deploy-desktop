import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/build-page');
  }, []);

  return <></>;
};

export default MainPage;
