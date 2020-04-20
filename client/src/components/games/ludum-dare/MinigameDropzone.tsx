import React, { useRef, useState } from 'react';
import {
  LudumMinigameDropzoneState,
  LudumGameState,
} from '@server/store/games/ludum-dare/types';
import {
  motion,
  DraggableProps,
  DragHandlers,
  PanInfo,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import styles from './MinigameDropzone.module.css';
import cx from 'classnames';

export interface LudumMinigameDropzoneProps {
  game: LudumGameState;
  minigame: LudumMinigameDropzoneState;
}

const LudumMinigameDropzone: React.FC<LudumMinigameDropzoneProps> = ({
  game,
  minigame,
}) => {
  const cardX = useMotionValue(0);
  const xRangeOpacity = [-200, -100, 100, 200];
  const opacity = useTransform(cardX, xRangeOpacity, [0, 1, 1, 0]);
  const xRangeRotation = [-200, -10, 10, 200];
  const rotation = useTransform(cardX, xRangeRotation, [-10, 0, 0, 10]);
  const yesOpacity = useTransform(cardX, xRangeRotation, [0, 0, 0, 1]);
  const noOpacity = useTransform(cardX, xRangeRotation, [1, 0, 0, 0]);

  const [score, setScore] = useState(0);

  const onDragEnd: DragHandlers['onDragEnd'] = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {};

  const ballRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.wrapper}>
      <div>dropzone!!!</div>
      <div className={styles.field}>
        <motion.div
          ref={ballRef}
          className={styles.card}
          drag={'x'}
          dragMomentum={true}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={onDragEnd}
          onDrag={onDragEnd}
          style={{ x: cardX, opacity, rotate: rotation }}
        >
          <motion.div
            style={{ opacity: yesOpacity }}
            className={cx(styles.cardJudgment, styles.cardJudgmentTrue)}
          >
            TRUE
          </motion.div>
          <motion.div
            style={{ opacity: noOpacity }}
            className={cx(styles.cardJudgment, styles.cardJudgmentFalse)}
          >
            FALSE
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LudumMinigameDropzone;
