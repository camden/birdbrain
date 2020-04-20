import React from 'react';
import { LudumMinigamePizzaTopping } from '@server/store/games/ludum-dare/types';
import Circle1 from 'assets/images/ludum-dare/gui/pizza/circlePat1.png';
import Circle2 from 'assets/images/ludum-dare/gui/pizza/circlePat2.png';
import Circle3 from 'assets/images/ludum-dare/gui/pizza/circlePat3.png';
import Circle4 from 'assets/images/ludum-dare/gui/pizza/circlePat4.png';
import Diamond1 from 'assets/images/ludum-dare/gui/pizza/dmndPat1.png';
import Diamond2 from 'assets/images/ludum-dare/gui/pizza/dmndPat2.png';
import Diamond3 from 'assets/images/ludum-dare/gui/pizza/dmndPat3.png';
import Diamond4 from 'assets/images/ludum-dare/gui/pizza/dmndPat4.png';
import Square1 from 'assets/images/ludum-dare/gui/pizza/sqrPat1.png';
import Square2 from 'assets/images/ludum-dare/gui/pizza/sqrPat2.png';
import Square3 from 'assets/images/ludum-dare/gui/pizza/sqrPat3.png';
import Square4 from 'assets/images/ludum-dare/gui/pizza/sqrPat4.png';
import Star1 from 'assets/images/ludum-dare/gui/pizza/starPat1.png';
import Star2 from 'assets/images/ludum-dare/gui/pizza/starPat2.png';
import Star3 from 'assets/images/ludum-dare/gui/pizza/starPat3.png';
import Star4 from 'assets/images/ludum-dare/gui/pizza/starPat4.png';
import Tee1 from 'assets/images/ludum-dare/gui/pizza/tbPat1.png';
import Tee2 from 'assets/images/ludum-dare/gui/pizza/tbPat2.png';
import Tee3 from 'assets/images/ludum-dare/gui/pizza/tbPat3.png';
import Tee4 from 'assets/images/ludum-dare/gui/pizza/tbPat4.png';
import Triangle1 from 'assets/images/ludum-dare/gui/pizza/triPat1.png';
import Triangle2 from 'assets/images/ludum-dare/gui/pizza/triPat2.png';
import Triangle3 from 'assets/images/ludum-dare/gui/pizza/triPat3.png';
import Triangle4 from 'assets/images/ludum-dare/gui/pizza/triPat4.png';

const toppingsMap: { [key in LudumMinigamePizzaTopping]: string } = {
  [LudumMinigamePizzaTopping.CIRCLE1]: Circle1,
  [LudumMinigamePizzaTopping.CIRCLE2]: Circle2,
  [LudumMinigamePizzaTopping.CIRCLE3]: Circle3,
  [LudumMinigamePizzaTopping.CIRCLE4]: Circle4,
  [LudumMinigamePizzaTopping.DIAMOND1]: Diamond1,
  [LudumMinigamePizzaTopping.DIAMOND2]: Diamond2,
  [LudumMinigamePizzaTopping.DIAMOND3]: Diamond3,
  [LudumMinigamePizzaTopping.DIAMOND4]: Diamond4,
  [LudumMinigamePizzaTopping.SQUARE1]: Square1,
  [LudumMinigamePizzaTopping.SQUARE2]: Square2,
  [LudumMinigamePizzaTopping.SQUARE3]: Square3,
  [LudumMinigamePizzaTopping.SQUARE4]: Square4,
  [LudumMinigamePizzaTopping.STAR1]: Star1,
  [LudumMinigamePizzaTopping.STAR2]: Star2,
  [LudumMinigamePizzaTopping.STAR3]: Star3,
  [LudumMinigamePizzaTopping.STAR4]: Star4,
  [LudumMinigamePizzaTopping.TEE1]: Tee1,
  [LudumMinigamePizzaTopping.TEE2]: Tee2,
  [LudumMinigamePizzaTopping.TEE3]: Tee3,
  [LudumMinigamePizzaTopping.TEE4]: Tee4,
  [LudumMinigamePizzaTopping.TRIANGLE1]: Triangle1,
  [LudumMinigamePizzaTopping.TRIANGLE2]: Triangle2,
  [LudumMinigamePizzaTopping.TRIANGLE3]: Triangle3,
  [LudumMinigamePizzaTopping.TRIANGLE4]: Triangle4,
};

const getImageSourceForTopping = (
  topping: LudumMinigamePizzaTopping
): string => {
  const result = toppingsMap[topping];
  if (!result) {
    return '';
  }

  return result;
};

export interface LudumPizzaToppingProps {
  kind: LudumMinigamePizzaTopping;
  className?: string;
  style?: React.CSSProperties;
}

const LudumPizzaTopping: React.FC<LudumPizzaToppingProps> = (props) => {
  return (
    <img
      src={getImageSourceForTopping(props.kind)}
      className={props.className}
      style={props.style}
    />
  );
};

export default LudumPizzaTopping;
