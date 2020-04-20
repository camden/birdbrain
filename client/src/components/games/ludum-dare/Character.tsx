import React, { useState } from 'react';
import styles from './Character.module.css';
import cx from 'classnames';

import allenIcon from 'assets/images/ludum-dare/characters/allen/allenIcon.png';
import allenIdle from 'assets/images/ludum-dare/characters/allen/allenIdle.png';
import allenLose from 'assets/images/ludum-dare/characters/allen/allenLoseAnim.gif';
import allenPuzzled from 'assets/images/ludum-dare/characters/allen/allenPuzz.png';
import allenWin from 'assets/images/ludum-dare/characters/allen/allenWinAnim.gif';
import allenTime from 'assets/images/ludum-dare/characters/allen/allenTime.png';
import barneyIcon from 'assets/images/ludum-dare/characters/barney/barneyIcon.png';
import barneyIdle from 'assets/images/ludum-dare/characters/barney/barneyIdle.png';
import barneyLose from 'assets/images/ludum-dare/characters/barney/barneyLoseAnim.gif';
import barneyPuzzled from 'assets/images/ludum-dare/characters/barney/barneyPuzz.png';
import barneyWin from 'assets/images/ludum-dare/characters/barney/barneyWinAnim.gif';
import barneyTime from 'assets/images/ludum-dare/characters/barney/barneyTime.png';
import daphneIcon from 'assets/images/ludum-dare/characters/daphne/daphneIcon.png';
import daphneIdle from 'assets/images/ludum-dare/characters/daphne/daphneIdle.png';
import daphneLose from 'assets/images/ludum-dare/characters/daphne/daphneLoseAnim.gif';
import daphnePuzzled from 'assets/images/ludum-dare/characters/daphne/daphnePuzz.png';
import daphneWin from 'assets/images/ludum-dare/characters/daphne/daphneWinAnim.gif';
import daphneTime from 'assets/images/ludum-dare/characters/daphne/daphneTime.png';
import garyIcon from 'assets/images/ludum-dare/characters/gary/garyIcon.png';
import garyIdle from 'assets/images/ludum-dare/characters/gary/garyIdle.png';
import garyLose from 'assets/images/ludum-dare/characters/gary/garyLoseAnim.gif';
import garyPuzzled from 'assets/images/ludum-dare/characters/gary/garyPuzz.png';
import garyWin from 'assets/images/ludum-dare/characters/gary/garyWinAnim.gif';
import garyTime from 'assets/images/ludum-dare/characters/gary/garyTime.png';
import montyIcon from 'assets/images/ludum-dare/characters/monty/montyIcon.png';
import montyIdle from 'assets/images/ludum-dare/characters/monty/montyIdle.png';
import montyLose from 'assets/images/ludum-dare/characters/monty/montyLoseAnim.gif';
import montyPuzzled from 'assets/images/ludum-dare/characters/monty/montyPuzz.png';
import montyWin from 'assets/images/ludum-dare/characters/monty/montyWinAnim.gif';
import montyTime from 'assets/images/ludum-dare/characters/monty/montyTime.png';
import ronIcon from 'assets/images/ludum-dare/characters/ron/ronIcon.png';
import ronIdle from 'assets/images/ludum-dare/characters/ron/ronIdle.png';
import ronLose from 'assets/images/ludum-dare/characters/ron/ronLoseAnim.gif';
import ronPuzzled from 'assets/images/ludum-dare/characters/ron/ronPuzz.png';
import ronWin from 'assets/images/ludum-dare/characters/ron/ronWinAnim.gif';
import ronTime from 'assets/images/ludum-dare/characters/ron/ronTime.png';
import sallyIcon from 'assets/images/ludum-dare/characters/sally/sallyIcon.png';
import sallyIdle from 'assets/images/ludum-dare/characters/sally/sallyIdle.png';
import sallyLose from 'assets/images/ludum-dare/characters/sally/sallyLoseAnim.gif';
import sallyPuzzled from 'assets/images/ludum-dare/characters/sally/sallyPuzz.png';
import sallyWin from 'assets/images/ludum-dare/characters/sally/sallyWinAnim.gif';
import sallyTime from 'assets/images/ludum-dare/characters/sally/sallyTime.png';
import walterIcon from 'assets/images/ludum-dare/characters/walter/walterIcon.png';
import walterIdle from 'assets/images/ludum-dare/characters/walter/walterIdle.png';
import walterLose from 'assets/images/ludum-dare/characters/walter/walterLoseAnim.gif';
import walterPuzzled from 'assets/images/ludum-dare/characters/walter/walterPuzz.png';
import walterWin from 'assets/images/ludum-dare/characters/walter/walterWinAnim.gif';
import walterTime from 'assets/images/ludum-dare/characters/walter/walterTime.png';

export enum CharacterType {
  ICON = 'ICON',
  IDLE = 'IDLE',
  LOSE = 'LOSE',
  PUZZLED = 'PUZZLED',
  WIN = 'WIN',
  NERVOUS = 'NERVOUS',
}

export enum CharacterAnimation {
  HOVER = 'HOVER',
  HOVER_SMALL = 'HOVER_SMALL',
  SHAKE = 'SHAKE',
  SWAY = 'SWAY',
}

const characters: any = {
  allen: {
    [CharacterType.ICON]: allenIcon,
    [CharacterType.IDLE]: allenIdle,
    [CharacterType.LOSE]: allenLose,
    [CharacterType.PUZZLED]: allenPuzzled,
    [CharacterType.WIN]: allenWin,
    [CharacterType.NERVOUS]: allenTime,
  },
  barney: {
    [CharacterType.ICON]: barneyIcon,
    [CharacterType.IDLE]: barneyIdle,
    [CharacterType.LOSE]: barneyLose,
    [CharacterType.PUZZLED]: barneyPuzzled,
    [CharacterType.WIN]: barneyWin,
    [CharacterType.NERVOUS]: barneyTime,
  },
  daphne: {
    [CharacterType.ICON]: daphneIcon,
    [CharacterType.IDLE]: daphneIdle,
    [CharacterType.LOSE]: daphneLose,
    [CharacterType.PUZZLED]: daphnePuzzled,
    [CharacterType.WIN]: daphneWin,
    [CharacterType.NERVOUS]: daphneTime,
  },
  gary: {
    [CharacterType.ICON]: garyIcon,
    [CharacterType.IDLE]: garyIdle,
    [CharacterType.LOSE]: garyLose,
    [CharacterType.PUZZLED]: garyPuzzled,
    [CharacterType.WIN]: garyWin,
    [CharacterType.NERVOUS]: garyTime,
  },
  monty: {
    [CharacterType.ICON]: montyIcon,
    [CharacterType.IDLE]: montyIdle,
    [CharacterType.LOSE]: montyLose,
    [CharacterType.PUZZLED]: montyPuzzled,
    [CharacterType.WIN]: montyWin,
    [CharacterType.NERVOUS]: montyTime,
  },
  ron: {
    [CharacterType.ICON]: ronIcon,
    [CharacterType.IDLE]: ronIdle,
    [CharacterType.LOSE]: ronLose,
    [CharacterType.PUZZLED]: ronPuzzled,
    [CharacterType.WIN]: ronWin,
    [CharacterType.NERVOUS]: ronTime,
  },
  sally: {
    [CharacterType.ICON]: sallyIcon,
    [CharacterType.IDLE]: sallyIdle,
    [CharacterType.LOSE]: sallyLose,
    [CharacterType.PUZZLED]: sallyPuzzled,
    [CharacterType.WIN]: sallyWin,
    [CharacterType.NERVOUS]: sallyTime,
  },
  walter: {
    [CharacterType.ICON]: walterIcon,
    [CharacterType.IDLE]: walterIdle,
    [CharacterType.LOSE]: walterLose,
    [CharacterType.PUZZLED]: walterPuzzled,
    [CharacterType.WIN]: walterWin,
    [CharacterType.NERVOUS]: walterTime,
  },
};

export interface LudumCharacterProps {
  id: string;
  type?: CharacterType;
  className?: string;
  animation?: CharacterAnimation;
  typeWhenPressed?: CharacterType;
  disablePressChange?: boolean;
}

const LudumCharacter: React.FC<LudumCharacterProps> = ({
  id,
  type,
  className,
  animation,
  typeWhenPressed,
  disablePressChange,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const pressedType = typeWhenPressed || CharacterType.WIN;
  const unpressedType = type || CharacterType.IDLE;

  const shouldChangeOnPress =
    !disablePressChange && unpressedType !== CharacterType.ICON;

  const finalType =
    shouldChangeOnPress && isPressed ? pressedType : unpressedType;

  const url = characters[id] && characters[id][finalType];

  if (!url) {
    console.error(
      `Could not find url for character with id '${id}' and type '${type}'.`
    );
  }

  return (
    <div
      className={cx(styles.wrapper, className, {
        [styles.hover]: animation === CharacterAnimation.HOVER,
        [styles.shake]: animation === CharacterAnimation.SHAKE,
        [styles.sway]: animation === CharacterAnimation.SWAY,
        [styles.hoverSmall]: animation === CharacterAnimation.HOVER_SMALL,
      })}
    >
      <img
        alt={`Character named ${id}`}
        onMouseDown={() => setIsPressed(true)}
        onTouchStart={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchEnd={() => setIsPressed(false)}
        src={url}
        className={cx(styles.characterImage, {
          [styles.pressed]: isPressed,
        })}
      />
    </div>
  );
};

export default LudumCharacter;
