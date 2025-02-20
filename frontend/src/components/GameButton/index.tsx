import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

type CustomButtonProps = {
  text: string;
  onClick: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  unthrottable?: boolean;
  sx?: any;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  loading = false,
  fullWidth,
  disabled,
  rounded,
  unthrottable,
  sx,
}) => {
  const [isThrottled, setIsThrottled] = useState(false);

  const handleClick = () => {
    if (isThrottled) return;
    onClick();
    if (!unthrottable) setIsThrottled(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsThrottled(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isThrottled]);

  return (
    <Button
      className={styles.root}
      style={{
        width: fullWidth ? '100%' : 'unset',
        borderRadius: rounded ? '99px' : '4px',
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={handleClick}
      disabled={disabled || loading || isThrottled}
      sx={sx}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 16 }}>{text}</Typography>
      </Box>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 16px',
          }}
        >
          <CircularProgress
            style={{
              color: 'white',
              width: 24,
              height: 24,
            }}
          />
        </Box>
      )}
    </Button>
  );
};

export default CustomButton;
