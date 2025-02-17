import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';
import CustomButton from "components/CustomButton";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoSelection = () => {
    navigate('/Game');
  };


  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
          <Box sx={{ display: 'flex', textAlign: 'center' }}>
            <Typography variant={'h1'} className={styles.title}>
              Nexus TD
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '350px', gap: 3, mt: 4 }}>
          <CustomButton onClick={handleGoSelection} text={'PLAY'} fullWidth />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
