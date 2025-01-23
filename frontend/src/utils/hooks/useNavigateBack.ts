import { useNavigate, useLocation } from 'react-router-dom';

const useNavigateBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    navigateBack: (defaultPath: string) => {
      if (location.key !== 'default') {
        navigate(-1);
      } else {
        navigate(defaultPath);
      }
    },
  };
};

export default useNavigateBack;
