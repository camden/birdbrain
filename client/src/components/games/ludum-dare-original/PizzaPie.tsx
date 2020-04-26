import React, { useEffect, useState } from 'react';
import { LudumOriginalMinigamePizzaTopping } from '@server/store/games/ludum-dare-original/types';
import styles from './PizzaPie.module.css';

import PizzaBase from 'assets/images/ludum-dare-original/gui/pizza/pizzaBase.png';
import LudumOriginalPizzaTopping from './PizzaTopping';
import { pickRandomNumber } from '@server/utils/rng';
import { setPointerCapture } from 'konva/types/PointerEvents';
import shuffleArray from '@server/utils/shuffle-array';

export interface LudumOriginalPizzaPieProps {
  toppings: LudumOriginalMinigamePizzaTopping[];
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
  [30, 42],
  [80, 110],
  [66, 70],
  [100, 45],
  [70, 50],
  [50, 90],
  [81, 28],
  [90, 88],
  [60, 23],
  [25, 97],
  [23, 75],
  [75, 92],
  [37, 25],
  [105, 67],
];

const getToppingPositionForIndex = (
  index: number,
  positions: number[][]
): { x: number; y: number } => {
  if (positions.length === 0) {
    return { x: 75, y: 75 };
  }

  const result = positions[index];
  if (!result) {
    const fakeResult = positions[0];
    return { x: fakeResult[0], y: fakeResult[1] };
  }

  return { x: result[0], y: result[1] };
};

const LudumOriginalPizzaPie: React.FC<LudumOriginalPizzaPieProps> = ({
  toppings,
  style,
}) => {
  const [positions, setPositions] = useState<number[][]>([]);

  useEffect(() => {
    setPositions(shuffleArray([...toppingPositions]));
  }, []);

  return (
    <div className={styles.wrapper} style={style}>
      <img src={PizzaBase} className={styles.pizzaImg} alt="pizza base" />
      {toppings.map((topping, idx) => (
        <LudumOriginalPizzaTopping
          key={topping + '' + idx}
          kind={topping}
          className={styles.topping}
          style={{
            transform: `rotate(${pickRandomNumber(1, 360)}deg)`,
            left: getToppingPositionForIndex(idx, positions).x,
            top: getToppingPositionForIndex(idx, positions).y,
          }}
        />
      ))}
    </div>
  );
};

export default LudumOriginalPizzaPie;
