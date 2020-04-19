import React, { useState, useEffect, useRef } from 'react';
import {
  LudumMinigameReflexesState,
  LudumGameState,
} from '@server/store/games/ludum-dare/types';
import { motion, useMotionValue } from 'framer-motion';
import styles from './MinigameReflexes.module.css';
import Button from 'components/shared/button/Button';

export interface LudumMinigameReflexesProps {
  game: LudumGameState;
  minigame: LudumMinigameReflexesState;
}

const LudumMinigameReflexes: React.FC<LudumMinigameReflexesProps> = ({
  game,
  minigame,
}) => {
  const [stopValues, setStopValues] = useState<number[]>([0, 0, 0]);
  const x1 = useMotionValue(0);
  const x2 = useMotionValue(0);
  const x3 = useMotionValue(0);

  const timer = useRef<NodeJS.Timeout>();

  const onStopClick = () => {
    setStopValues([x1.get(), x2.get(), x3.get()]);
    x1.stop();
    x2.stop();
    x3.stop();
  };

  useEffect(() => {
    return () => {};
  });

  const targetBarWidth = 50;

  const halfBarWidth = 100;
  const halfTargetBarWidth = targetBarWidth / 2;

  const inRange = stopValues.every(
    (s) =>
      s >= halfBarWidth - halfTargetBarWidth &&
      s <= halfBarWidth + halfTargetBarWidth
  );

  return (
    <div className={styles.wrapper}>
      <div>reflexes</div>
      <div>in range: {inRange ? 'yes' : 'no'}</div>
      <div className={styles.barWrapper}>
        <div
          className={styles.targetBar}
          style={{ width: targetBarWidth }}
        ></div>
        <div className={styles.bar}>
          <motion.div
            className={styles.movingBar}
            style={{ x: x1 }}
            animate={{ x: [0, 200, 0] }}
            transition={{
              loop: Infinity,
              ease: 'linear',
              duration: 4.78,
              yoyo: Infinity,
            }}
          ></motion.div>
        </div>
      </div>
      <div className={styles.barWrapper}>
        <div
          className={styles.targetBar}
          style={{ width: targetBarWidth }}
        ></div>
        <div className={styles.bar}>
          <motion.div
            className={styles.movingBar}
            style={{ x: x2 }}
            animate={{ x: [0, 200, 0] }}
            transition={{
              loop: Infinity,
              ease: 'linear',
              duration: 1.85,
              yoyo: Infinity,
            }}
          ></motion.div>
        </div>
      </div>
      <div className={styles.barWrapper}>
        <div
          className={styles.targetBar}
          style={{ width: targetBarWidth }}
        ></div>
        <div className={styles.bar}>
          <motion.div
            className={styles.movingBar}
            style={{ x: x3 }}
            animate={{ x: [0, 200, 0] }}
            transition={{
              loop: Infinity,
              ease: 'linear',
              duration: 2.7,
              yoyo: Infinity,
            }}
          ></motion.div>
        </div>
      </div>
      <Button onClick={onStopClick}>Stop</Button>
    </div>
  );
};

export default LudumMinigameReflexes;
