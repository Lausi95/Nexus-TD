import React, { useEffect } from 'react';
import CustomButton from 'components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { setContext } from '../game';
import { game } from '../App.tsx';
import { Box } from '@mui/material';

const Game: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get hold of the canvas context
    const canvas = document.getElementById('gameScreen-canvas');
    // @ts-ignore
    if (canvas) setContext(canvas.getContext('2d'));
    return () => {
      // @ts-ignore
      setContext(null);
    };
  }, []);

  useEffect(() => {
    game.start(0);
  }, []);

  const handleExit = () => {
    navigate('/home');
  };

  const handleAddTurret = () => {
    game.gameplayController.requestAddTurret();
  };

  return (
    <Box
      sx={{
        outline: '1px solid grey',
        width: 900,
        height: 500,
        display: 'grid',
        gridTemplateColumns: '640px 1fr',
      }}
    >
      <Box>
        <canvas
          id={'gameScreen-canvas'}
          width="640"
          height="400"
          style={{ border: '1px solid red' }}
        />
        <Box>
          <CustomButton text={'BACK'} onClick={handleExit} />
        </Box>
      </Box>
      <Box>
        <CustomButton text={'ADD TURRET'} onClick={handleAddTurret} />
        <CustomButton
          text={'SEND ENEMIES'}
          disabled={true}
          onClick={() => {}}
        />
        <CustomButton
          text={'RESET EVERYTHING'}
          disabled={true}
          onClick={() => {}}
        />
      </Box>
      {/*<Hud game={game} reset={resetToggle} />*/}
      {/*{gameState === GAME_STATE.PAUSED ? <Pause game={game} toggleReset={startLevel} /> : null}*/}
    </Box>
  );
};

export default Game;
