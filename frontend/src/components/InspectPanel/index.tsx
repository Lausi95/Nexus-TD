import { Box, Typography } from '@mui/material';
import React from 'react';
import DamageIcon from '@mui/icons-material/LocalFireDepartment';
import SpeedIcon from '@mui/icons-material/Speed';
import RadarIcon from '@mui/icons-material/TrackChangesRounded';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store.ts';

type TProps = {};

/**
 * Turret name
 * Damage
 * Attack Speed
 * Radius
 *
 * */

const InspectPanel: React.FC<TProps> = () => {
  const { inspectedDefender } = useSelector(
    (state: RootState) => state.gameSlice,
  );

  if (!inspectedDefender) {
    return (
      <Box
        sx={{
          width: 400,
          height: 170,
          border: '1px solid grey',
          borderRadius: '4px',
          px: 1,
          py: 0.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        Select a Turret
      </Box>
    );
  }
  const { name, damage, attackSpeed, radius } = inspectedDefender;

  return (
    <Box
      sx={{
        width: 400,
        height: 170,
        border: '1px solid grey',
        borderRadius: '4px',
        px: 1,
        py: 0.5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'space-around',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 16, color: 'white' }}>{name}</Typography>
        </Box>
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexWrap: 'nowrap',*/}
        {/*    alignItems: 'center',*/}
        {/*    gap: '2px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography sx={{ fontSize: 12, color: 'white' }}>*/}
        {/*    Cost: 10*/}
        {/*  </Typography>*/}
        {/*  <PaidIcon sx={{ color: COLOR.YELLOW, fontSize: 12 }} />*/}
        {/*</Box>*/}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '50% 1fr' }}>
        <Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <DamageIcon sx={{ fontSize: 14, color: 'white' }} />
              <Typography sx={{ fontSize: 14, color: 'white' }}>
                Damage: {damage}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <SpeedIcon sx={{ fontSize: 14, color: 'white' }} />
              <Typography sx={{ fontSize: 14, color: 'white' }}>
                Attack Speed: {attackSpeed}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <RadarIcon sx={{ fontSize: 14, color: 'white' }} />
              <Typography sx={{ fontSize: 14, color: 'white' }}>
                Radius: {radius}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
          }}
        >
          {/*<Box>hey</Box>*/}
        </Box>
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'column',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Box>*/}
        {/*    <Typography sx={{ fontSize: 10, color: 'white' }}>*/}
        {/*      Description: A short range hitscan weapon with medium damage*/}
        {/*      output*/}
        {/*    </Typography>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </Box>
    </Box>
  );
};

export default InspectPanel;
