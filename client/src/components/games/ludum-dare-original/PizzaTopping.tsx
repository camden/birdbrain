import React from 'react';
import { LudumOriginalMinigamePizzaTopping } from '@server/store/games/ludum-dare-original/types';
import Circle1 from 'assets/images/ludum-dare-original/gui/pizza/circlePat1.png';
import Circle2 from 'assets/images/ludum-dare-original/gui/pizza/circlePat2.png';
import Circle3 from 'assets/images/ludum-dare-original/gui/pizza/circlePat3.png';
import Circle4 from 'assets/images/ludum-dare-original/gui/pizza/circlePat4.png';
import Diamond1 from 'assets/images/ludum-dare-original/gui/pizza/dmndPat1.png';
import Diamond2 from 'assets/images/ludum-dare-original/gui/pizza/dmndPat2.png';
import Diamond3 from 'assets/images/ludum-dare-original/gui/pizza/dmndPat3.png';
import Diamond4 from 'assets/images/ludum-dare-original/gui/pizza/dmndPat4.png';
import Square1 from 'assets/images/ludum-dare-original/gui/pizza/sqrPat1.png';
import Square2 from 'assets/images/ludum-dare-original/gui/pizza/sqrPat2.png';
import Square3 from 'assets/images/ludum-dare-original/gui/pizza/sqrPat3.png';
import Square4 from 'assets/images/ludum-dare-original/gui/pizza/sqrPat4.png';
import Star1 from 'assets/images/ludum-dare-original/gui/pizza/starPat1.png';
import Star2 from 'assets/images/ludum-dare-original/gui/pizza/starPat2.png';
import Star3 from 'assets/images/ludum-dare-original/gui/pizza/starPat3.png';
import Star4 from 'assets/images/ludum-dare-original/gui/pizza/starPat4.png';
import Tee1 from 'assets/images/ludum-dare-original/gui/pizza/tbPat1.png';
import Tee2 from 'assets/images/ludum-dare-original/gui/pizza/tbPat2.png';
import Tee3 from 'assets/images/ludum-dare-original/gui/pizza/tbPat3.png';
import Tee4 from 'assets/images/ludum-dare-original/gui/pizza/tbPat4.png';
import Triangle1 from 'assets/images/ludum-dare-original/gui/pizza/triPat1.png';
import Triangle2 from 'assets/images/ludum-dare-original/gui/pizza/triPat2.png';
import Triangle3 from 'assets/images/ludum-dare-original/gui/pizza/triPat3.png';
import Triangle4 from 'assets/images/ludum-dare-original/gui/pizza/triPat4.png';

const toppingsMap: { [key in LudumOriginalMinigamePizzaTopping]: string } = {
  [LudumOriginalMinigamePizzaTopping.CIRCLE1]: Circle1,
  [LudumOriginalMinigamePizzaTopping.CIRCLE2]: Circle2,
  [LudumOriginalMinigamePizzaTopping.CIRCLE3]: Circle3,
  [LudumOriginalMinigamePizzaTopping.CIRCLE4]: Circle4,
  [LudumOriginalMinigamePizzaTopping.DIAMOND1]: Diamond1,
  [LudumOriginalMinigamePizzaTopping.DIAMOND2]: Diamond2,
  [LudumOriginalMinigamePizzaTopping.DIAMOND3]: Diamond3,
  [LudumOriginalMinigamePizzaTopping.DIAMOND4]: Diamond4,
  [LudumOriginalMinigamePizzaTopping.SQUARE1]: Square1,
  [LudumOriginalMinigamePizzaTopping.SQUARE2]: Square2,
  [LudumOriginalMinigamePizzaTopping.SQUARE3]: Square3,
  [LudumOriginalMinigamePizzaTopping.SQUARE4]: Square4,
  [LudumOriginalMinigamePizzaTopping.STAR1]: Star1,
  [LudumOriginalMinigamePizzaTopping.STAR2]: Star2,
  [LudumOriginalMinigamePizzaTopping.STAR3]: Star3,
  [LudumOriginalMinigamePizzaTopping.STAR4]: Star4,
  [LudumOriginalMinigamePizzaTopping.TEE1]: Tee1,
  [LudumOriginalMinigamePizzaTopping.TEE2]: Tee2,
  [LudumOriginalMinigamePizzaTopping.TEE3]: Tee3,
  [LudumOriginalMinigamePizzaTopping.TEE4]: Tee4,
  [LudumOriginalMinigamePizzaTopping.TRIANGLE1]: Triangle1,
  [LudumOriginalMinigamePizzaTopping.TRIANGLE2]: Triangle2,
  [LudumOriginalMinigamePizzaTopping.TRIANGLE3]: Triangle3,
  [LudumOriginalMinigamePizzaTopping.TRIANGLE4]: Triangle4,
};

const getImageSourceForTopping = (
  topping: LudumOriginalMinigamePizzaTopping
): string => {
  const result = toppingsMap[topping];
  if (!result) {
    return '';
  }

  return result;
};

export interface LudumOriginalPizzaToppingProps {
  kind: LudumOriginalMinigamePizzaTopping;
  className?: string;
  style?: React.CSSProperties;
}

const LudumOriginalPizzaTopping: React.FC<LudumOriginalPizzaToppingProps> = (
  props
) => {
  return (
    <img
      src={getImageSourceForTopping(props.kind)}
      className={props.className}
      style={props.style}
    />
  );
};

export default LudumOriginalPizzaTopping;
