import React from 'react';
import { LudumMinigamePizzaTopping } from '@server/store/games/ludum-dare/types';
import styles from './PizzaPie.module.css';

import PizzaBase from 'assets/images/ludum-dare/gui/pizza/pizzaBase.png';
import LudumPizzaTopping from './PizzaTopping';
import { pickRandomNumber } from '@server/utils/rng';

export interface LudumPizzaPieProps {
  toppings: LudumMinigamePizzaTopping[];
  style?: React.CSSProperties;
}

const getRandomPointOnCircle = (radius: number): { x: number; y: number } => {
  const randomDistance = 1;
  const randomAngle = 1;
  const x = Math.sqrt(randomDistance) * Math.cos(randomAngle);
  const y = Math.sqrt(randomDistance) * Math.sin(randomAngle);
  return { x, y };
};

const toppingPositions = [
  [40, 67],
  [42, 120],
  [80, 150],
  [100, 80],
  [120, 45],
  [70, 50],
  [50, 90],
  [70, 110],
  [90, 130],
  [120, 125],
  [130, 95],
];

const getToppingPositionForIndex = (
  index: number
): { x: number; y: number } => {
  const result = toppingPositions[index];
  if (!result) {
    return { x: 0, y: 0 };
  }

  return { x: result[0], y: result[1] };
};

const LudumPizzaPie: React.FC<LudumPizzaPieProps> = ({ toppings, style }) => {
  return (
    <div className={styles.wrapper} style={style}>
      <img src={PizzaBase} className={styles.pizzaImg} alt="pizza base" />
      {toppings.map((topping, idx) => (
        <LudumPizzaTopping
          key={topping + '' + idx}
          kind={topping}
          className={styles.topping}
          style={{
            transform: `rotate(${pickRandomNumber(1, 360)}deg)`,
            left: getToppingPositionForIndex(idx).x,
            top: getToppingPositionForIndex(idx).y,
          }}
        />
      ))}
    </div>
  );
};

export default LudumPizzaPie;
