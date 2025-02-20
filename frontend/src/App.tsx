import Routes from './router/Routes';
import styles from './App.module.scss';
import startEngine from './game';
import Game from 'game/engine/Game.ts';
import clsx from 'clsx';
import initialize from './utils/initialize.ts';
import { AppDispatch } from './redux/store.ts';
import { useDispatch } from 'react-redux';
// Init tokens
initialize();
console.log('INITIALIZE ENGINE');
const game: Game = startEngine();
export { game };

function App() {
  const _dispatch: AppDispatch = useDispatch();

  return (
    <div className={clsx(styles.app)}>
      <div className={styles.mainWindow}>
        {/*<VfxAnimation>*/}
        <Routes />
        {/*</VfxAnimation>*/}
      </div>
    </div>
  );
}

export default App;
