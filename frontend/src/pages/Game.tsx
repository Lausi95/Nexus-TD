import React, { useEffect } from 'react';
import CustomButton from 'components/CustomButton';
import { useNavigate } from 'react-router-dom';
import HeartIcon from '@mui/icons-material/Favorite';
import PaidIcon from '@mui/icons-material/Paid';
import { setContext } from '../game';
import { game } from '../App.tsx';
import { Box, Typography } from '@mui/material';
import { COLOR } from 'game/enum/colors.ts';
import { RootState } from 'redux/store.ts';
import { useSelector } from 'react-redux';
import GameButton from 'components/GameButton';
import InspectPanel from 'components/InspectPanel';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { hp, gold, platinum } = useSelector(
    (state: RootState) => state.gameSlice,
  );

  useEffect(() => {
    const canvas = document.getElementById(
      'gameScreen-canvas',
    ) as HTMLCanvasElement;
    if (canvas) setContext(canvas.getContext('2d'));
    return () => {
      setContext(null);
    };
  }, []);

  useEffect(() => {
    // game.start(0);
  }, []);

  const handleExit = () => {
    navigate('/home');
  };

  const handleAddTurret = () => {
    game.gameplayController.requestAddTurret();
  };

  const handleStart = () => {
    game.gameplayController.startLevel(0);
  };

  const handleReset = () => {
    game.gameplayController.resetLevel();
  };

  return (
    <Box
      sx={{
        outline: '1px solid grey',
        width: 900,
        height: 600,
        display: 'grid',
        gridTemplateColumns: '640px 1fr',
      }}
    >
      <Box>
        <canvas
          id={'gameScreen-canvas'}
          width="640"
          height="400"
          style={{ border: '1px solid grey' }}
        />
        <Box
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ dispaly: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', wrap: 'nowrap', gap: 1 }}>
              <HeartIcon sx={{ color: COLOR.PRIMARY }} />
              <Typography sx={{ color: 'white' }}>{hp}</Typography>
            </Box>

            <Box sx={{ display: 'flex', wrap: 'nowrap', gap: 1 }}>
              <PaidIcon sx={{ color: COLOR.YELLOW }} />
              <Typography sx={{ color: 'white' }}>{gold}</Typography>
            </Box>

            <Box sx={{ display: 'flex', wrap: 'nowrap', gap: 1 }}>
              <PaidIcon sx={{ color: COLOR.PORTAL_BLUE }} />
              <Typography sx={{ color: 'white' }}>{platinum}</Typography>
            </Box>
          </Box>
          <InspectPanel />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            gap: 1,
            p: 1,
          }}
        >
          {/*<PurchasePanel />*/}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
            }}
          >
            <GameButton text={'Turret A'} onClick={handleAddTurret} />
            <GameButton text={'Turret B'} onClick={handleAddTurret} />
            <GameButton text={'Turret C'} onClick={handleAddTurret} />
            <GameButton text={'Turret D'} onClick={handleAddTurret} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          <GameButton text={'SEND ENEMIES'} onClick={handleStart} />
          <GameButton text={'RESET EVERYTHING'} onClick={handleReset} />
          <CustomButton text={'EXIT'} onClick={handleExit} />
        </Box>
      </Box>
      {/*<Hud game={game} reset={resetToggle} />*/}
      {/*{gameState === GAME_STATE.PAUSED ? <Pause game={game} toggleReset={startLevel} /> : null}*/}
    </Box>
  );
};

export default Game;
