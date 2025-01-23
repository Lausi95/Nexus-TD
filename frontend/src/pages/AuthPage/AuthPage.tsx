import React from 'react';
import { Box} from '@mui/material';
import styles from './AuthPage.module.scss';

const AuthPage: React.FC = () => {

  return (
    <Box className={styles.root}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '16px',
          width: '100%',
          height: '100%',
        }}
      >
        <Box className={styles.title}>DODGE</Box>
        AUTH page
      </Box>
    </Box>
  );
};

export default AuthPage;
