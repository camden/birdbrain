import React, { useRef, useState, ReactChildren, ReactNode } from 'react';
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
  useAnimation,
  AnimatePresence,
  MotionProps,
} from 'framer-motion';
import styles from './MinigameDropzone.module.css';
import cx from 'classnames';

export interface LudumMinigameDropzoneProps {
  game: LudumGameState;
  minigame: LudumMinigameDropzoneState;
}

// thank you to https://framerbook.com/x/animation/example-animations/36-stack-3d/
const LudumMinigameDropzone: React.FC<LudumMinigameDropzoneProps> = ({
  game,
  minigame,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [exitX, setExitX] = React.useState<number | string>('100%');
  const [score, setScore] = useState(0);

  const cards = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

  return (
    <div className={styles.wrapper}>
      <div>dropzone!!!</div>
      <div>score: {score}</div>
      <div className={styles.field}>
        <AnimatePresence initial={false}>
          <Card
            key={cardIndex + 1}
            index={cardIndex + 1}
            setIndex={setCardIndex}
            setExitX={setExitX}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 0.9,
              opacity: 0.5,
            }}
            transition={{
              scale: { duration: 0.2 },
              opacity: { duration: 0.4 },
            }}
          >
            {cards[cardIndex + 1]}
          </Card>
          <Card
            key={cardIndex}
            index={cardIndex}
            setIndex={setCardIndex}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
            }}
            drag={'x'}
            exitX={exitX}
            setExitX={setExitX}
          >
            {cards[cardIndex]}
          </Card>
        </AnimatePresence>
      </div>
    </div>
  );
};

export interface CardProps {
  children?: ReactNode;
  index: number;
  setIndex: (idx: number) => void;
  drag?: boolean | 'x' | 'y' | undefined;
  exitX?: number | string;
  setExitX: (x: number) => void;
  initial?: MotionProps['initial'];
  animate?: MotionProps['animate'];
  transition?: MotionProps['transition'];
}

const Card: React.FC<CardProps> = (props) => {
  const cardX = useMotionValue(0);
  const xRangeRotation = [-200, -10, 10, 200];
  const cardRotation = useTransform(cardX, xRangeRotation, [-10, 0, 0, 10]);
  const yesOpacity = useTransform(cardX, xRangeRotation, [0, 0, 0, 1]);
  const noOpacity = useTransform(cardX, xRangeRotation, [1, 0, 0, 0]);

  const onDragEnd: DragHandlers['onDragEnd'] = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -100) {
      props.setExitX(-350);
      props.setIndex(props.index + 1);
    }
    if (info.offset.x > 100) {
      props.setExitX(350);
      props.setIndex(props.index + 1);
    }
  };

  return (
    <motion.div
      className={styles.card}
      whileTap={{ scale: 1.05, cursor: 'grabbing' }}
      drag={props.drag}
      dragMomentum={true}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      initial={props.initial}
      animate={props.animate}
      transition={props.transition}
      style={{
        x: cardX,
        rotate: cardRotation,
      }}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 1,
        transition: { duration: 0.2 },
      }}
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
      {props.children}
    </motion.div>
  );
};

export default LudumMinigameDropzone;
