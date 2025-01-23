import React from 'react';
const Game: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <div
    >
      <canvas id={'gameScreen-canvas'} width="900" height="500" />
      {/*<Hud game={game} reset={resetToggle} />*/}
      {/*{gameState === GAME_STATE.PAUSED ? <Pause game={game} toggleReset={startLevel} /> : null}*/}
    </div>
  );
};

export default Game;
