import React, { useRef, useState, ReactChildren, ReactNode } from 'react';
import {
  LudumMinigamePizzaState,
  LudumGameState,
  LudumMinigamePizzaCustomer,
  LudumMinigamePizzaEvaluation,
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
import styles from './MinigamePizza.module.css';
import cx from 'classnames';
import LudumPizzaPie from './PizzaPie';
import LudumPizzaTopping from './PizzaTopping';
import Button from 'components/shared/button/Button';
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface LudumMinigamePizzaProps {
  game: LudumGameState;
  minigame: LudumMinigamePizzaState;
}

const EXIT_X = 450;

// thank you to https://framerbook.com/x/animation/example-animations/36-stack-3d/
const LudumMinigamePizza: React.FC<LudumMinigamePizzaProps> = ({
  game,
  minigame,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [exitX, setExitX] = React.useState<number | string>('100%');
  const [score, setScore] = useState(0);
  const topCardAnimationControls = useAnimation();

  const onCorrectEval = () => {
    setScore(score + 1);
  };

  const onWrongEval = () => {
    setScore(score - 1);
  };

  const currentCustomer = minigame.customers[cardIndex];
  if (!currentCustomer) {
    if (cardIndex === 0) {
      console.error('something went wrong, expected current customer to exist');
      return null;
    }
    setCardIndex(0);
  }

  const onThumbsUp = async () => {
    currentCustomer.customerEvaluation === LudumMinigamePizzaEvaluation.LIKE
      ? onCorrectEval()
      : onWrongEval();

    setExitX(EXIT_X);
    await new Promise((resolve) => setTimeout(() => resolve(), 10));
    setCardIndex(cardIndex + 1);
  };

  const onThumbsDown = async () => {
    currentCustomer.customerEvaluation === LudumMinigamePizzaEvaluation.DISLIKE
      ? onCorrectEval()
      : onWrongEval();

    setExitX(-EXIT_X);
    await new Promise((resolve) => setTimeout(() => resolve(), 10));
    setCardIndex(cardIndex + 1);
  };

  const onSkip = async () => {
    currentCustomer.customerEvaluation === LudumMinigamePizzaEvaluation.SKIP
      ? onCorrectEval()
      : onWrongEval();

    setExitX(0);
    await new Promise((resolve) => setTimeout(() => resolve(), 10));
    setCardIndex(cardIndex + 1);
  };

  return (
    <div className={styles.wrapper}>
      <div>Pizza!!!</div>
      <div>target score: {minigame.targetScore}</div>
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
              scale: 0.95,
              opacity: 0.75,
            }}
            transition={{
              scale: { duration: 0.2 },
              opacity: { duration: 0.4 },
            }}
          >
            {minigame.customers[cardIndex + 1] && (
              <LudumPizzaCardBody
                customer={minigame.customers[cardIndex + 1]}
              />
            )}
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
            transition={{
              opacity: { duration: 0.2 },
            }}
            drag={'x'}
            exitX={exitX}
            setExitX={setExitX}
            onSwipeLeft={onThumbsDown}
            onSwipeRight={onThumbsUp}
          >
            {minigame.customers[cardIndex] && (
              <LudumPizzaCardBody customer={minigame.customers[cardIndex]} />
            )}
          </Card>
        </AnimatePresence>
      </div>
      <div className={styles.buttons}>
        <Button secondary onClick={onThumbsDown}>
          <FontAwesomeIcon icon={faThumbsDown} size={'lg'} color="red" />
        </Button>
        <Button secondary onClick={onSkip}>
          Skip Pizza
        </Button>
        <Button secondary onClick={onThumbsUp}>
          <FontAwesomeIcon icon={faThumbsUp} size={'lg'} color="green" />
        </Button>
      </div>
    </div>
  );
};

export interface LudumPizzaCardBodyProps {
  customer: LudumMinigamePizzaCustomer;
}

const LudumPizzaCardBody: React.FC<LudumPizzaCardBodyProps> = ({
  customer,
}) => {
  return (
    <>
      <div className={styles.speechBubble}>
        <div className={styles.dialogueLine}>
          <div>I like:</div>
          <div className={styles.listOfToppings}>
            {customer.likes.map((topping) => (
              <LudumPizzaTopping key={topping} kind={topping} />
            ))}
          </div>
        </div>
        <div className={styles.dialogueLine}>
          <div>I don't like:</div>
          <div className={styles.listOfToppings}>
            {customer.dislikes.map((topping) => (
              <LudumPizzaTopping key={topping} kind={topping} />
            ))}
          </div>
        </div>
      </div>
      <LudumPizzaPie
        toppings={customer.pizza}
        style={{ transform: `rotate(${customer.randomPizzaRotation}deg)` }}
      />
    </>
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
  variants?: MotionProps['variants'];
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
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
    if (info.offset.x < -90) {
      // props.setExitX(-EXIT_X);
      // props.setIndex(props.index + 1);
      props.onSwipeLeft && props.onSwipeLeft();
    }
    if (info.offset.x > 90) {
      // props.setExitX(EXIT_X);
      // props.setIndex(props.index + 1);
      props.onSwipeRight && props.onSwipeRight();
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
      variants={props.variants}
      style={{
        x: cardX,
        rotate: cardRotation,
      }}
      exit={{
        x: props.exitX,
        opacity: 0,
        scale: 1,
        transition: { duration: 0.6 },
      }}
    >
      <motion.div
        style={{ opacity: yesOpacity }}
        className={cx(styles.cardJudgment, styles.cardJudgmentTrue)}
      >
        LIKES
      </motion.div>
      <motion.div
        style={{ opacity: noOpacity }}
        className={cx(styles.cardJudgment, styles.cardJudgmentFalse)}
      >
        DISLIKES
      </motion.div>
      {props.children}
    </motion.div>
  );
};

export default LudumMinigamePizza;
